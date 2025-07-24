export interface Campaign {
  id: string;
  name: string;
  masterVideoUrl: string | null;
  createdAt: string;
}

export interface Job {
  id: string;
  campaignId: string;
  leadJson: Record<string, unknown>;
  status: "queued" | "rendering" | "done" | "error";
  error?: string;
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