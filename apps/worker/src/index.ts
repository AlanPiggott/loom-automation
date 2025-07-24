import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import spawn from "cross-spawn";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ---------- env ----------
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  CF_ACCOUNT_ID,
  CF_STREAM_TOKEN,
  SUPABASE_STORAGE_BUCKET = "thumbs"
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !CF_ACCOUNT_ID || !CF_STREAM_TOKEN) {
  console.error("Missing env vars – abort.");
  process.exit(1);
}

// ---------- helpers ----------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function nextQueuedJob() {
  const { data } = await supabase
    .from("jobs")
    .select("*, campaigns!inner(master_video_url)")
    .eq("status", "queued")
    .limit(1)
    .single();
  return data as any | null;
}

async function mark(jobId: string, fields: Record<string, unknown>) {
  await supabase.from("jobs").update(fields).eq("id", jobId);
}

function run(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code: number | null) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(" ")} exit ${code}`))));
  });
}

// ---------- main loop ----------
(async function loop() {
  while (true) {
    const job = await nextQueuedJob();
    if (!job) {
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }

    console.log("Picked job", job.id);
    await mark(job.id, { status: "rendering" });

    try {
      // 1. prepare temp dir
      const dir = await fs.mkdtemp(path.join("/tmp/", "render-"));
      const screenPath = path.join(dir, "screen.mp4");
      const masterPath = path.join(dir, "master.mp4");
      const outPath = path.join(dir, "out.mp4");
      const gifPath = path.join(dir, "thumb.gif");

      // 2. record website
      const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } });
      const page = await browser.newPage();
      await page.goto(job.lead_json.website as string, { waitUntil: "networkidle2", timeout: 60000 });

      const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: false,
        fps: 25,
        videoFrame: {
          width: 1920,
          height: 1080
        }
      });
      await recorder.start(screenPath);
      // auto‑scroll
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let total = 0;
          const distance = 500;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            total += distance;
            if (total >= document.body.scrollHeight) clearInterval(timer), resolve();
          }, 300);
        });
      });
      await recorder.stop();
      await browser.close();

      // 3. fetch master clip
      if (!job.campaigns.master_video_url) throw new Error("campaign has no master video");
      const res = await fetch(job.campaigns.master_video_url as string);
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(masterPath, buf);

      // 4. merge w/ FFmpeg
      await run("ffmpeg", [
        "-i", screenPath,
        "-i", masterPath,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-shortest",
        "-y", outPath
      ]);

      // 5. thumbnail
      await run("ffmpeg", ["-ss", "2", "-t", "3", "-i", outPath, "-vf", "fps=12,scale=640:-1", "-y", gifPath]);

      // 6. upload video ➜ Cloudflare Stream
      const form = new FormData();
      const fileBuffer = await fs.readFile(outPath);
      const blob = new Blob([fileBuffer], { type: 'video/mp4' });
      form.set("file", blob, "out.mp4");
      const cfRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_STREAM_TOKEN}` },
        body: form as any
      }).then((r: Response) => r.json() as any);
      if (!cfRes.success) throw new Error("CF upload failed: " + JSON.stringify(cfRes.errors));

      const uid = cfRes.result.uid;
      const videoUrl = `https://videodelivery.net/${uid}/manifest/video.m3u8`;

      // 7. upload thumbnail ➜ Supabase Storage
      const { data: thumb } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(`${uid}.gif`, await fs.readFile(gifPath), { contentType: "image/gif", upsert: true });

      const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${uid}.gif`;

      // 8. mark done
      await mark(job.id, { status: "done", video_url: videoUrl, thumbnail_url: thumbnailUrl });
      console.log("✅ job done", job.id);
      await fs.rm(dir, { recursive: true, force: true });
    } catch (err: any) {
      console.error("Job failed", err);
      await mark(job.id, { status: "error", error_msg: err.message });
    }
  }
})();