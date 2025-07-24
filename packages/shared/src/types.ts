export interface Campaign {
  id: string;
  name: string;
  masterVideoUrl: string | null;
  createdAt: string;
}

export interface Job {
  id: string;
  campaign_id: string;
  lead_json: { email: string; website: string; [k: string]: unknown };
  status: "queued" | "rendering" | "done" | "error";
  error_msg?: string;
  video_url?: string;
  thumbnail_url?: string;
  created_at: string;
}

export type PageType = "COMPANY" | "STATIC";

export interface Page {
  id: string;
  campaign_id: string;
  position: number;
  type: PageType;
  payload_json: { url?: string };
  created_at: string;
}

export interface JobStatusCount {
  queued: number;
  rendering: number;
  done: number;
  error: number;
}