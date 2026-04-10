export type WheelOption = {
  label: string;
  color: string;
};

export type WheelRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  options: WheelOption[];
  result_message: string | null;
  spin_seconds: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type WheelInsert = {
  user_id: string;
  slug: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  options: WheelOption[];
  result_message?: string | null;
  spin_seconds?: number;
  is_public?: boolean;
};