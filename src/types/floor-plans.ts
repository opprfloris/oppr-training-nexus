
export interface FloorPlanImage {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface FloorPlanUploadData {
  name: string;
  description?: string;
  file: File;
}
