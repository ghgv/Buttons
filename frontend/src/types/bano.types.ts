export interface BanoResponse {
  id: string;
  level_id: string;
  name: string;
  gender: "men" | "women" | "mixed" | "disabled";
  description?: string;
  created_at: string;
  updated_at?: string;
}