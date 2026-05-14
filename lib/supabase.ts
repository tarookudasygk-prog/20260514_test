// Supabase クライアント（サーバー側でのみ利用）
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// trips テーブルの行の型
export type Trip = {
  id: string;
  created_at: string;
  destination: string;
  apod_title: string | null;
  apod_url: string | null;
  apod_date: string | null;
  experience_text: string;
};

let client: SupabaseClient | null = null;

// クライアントを必要になった時点で生成する（ビルド時に env が無くても落ちないように遅延初期化）
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を .env.local に設定してください"
    );
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
