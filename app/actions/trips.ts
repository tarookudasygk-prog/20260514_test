"use server";

// 保存した宇宙旅行（trips テーブル）の Server Actions
import { revalidatePath } from "next/cache";
import { getSupabase, type Trip } from "@/lib/supabase";

// 保存済みの旅行を新しい順に取得
export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await getSupabase()
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`旅行の取得に失敗しました: ${error.message}`);
  }
  return data ?? [];
}

export type SaveTripInput = {
  destination: string;
  apodTitle: string;
  apodUrl: string;
  apodDate: string;
  experienceText: string;
};

// 旅行を1件保存
export async function saveTrip(input: SaveTripInput): Promise<void> {
  if (!input.destination.trim() || !input.experienceText.trim()) {
    throw new Error("行き先と体験テキストは必須です");
  }

  const { error } = await getSupabase().from("trips").insert({
    destination: input.destination.trim(),
    apod_title: input.apodTitle,
    apod_url: input.apodUrl,
    apod_date: input.apodDate,
    experience_text: input.experienceText,
  });

  if (error) {
    throw new Error(`保存に失敗しました: ${error.message}`);
  }
  revalidatePath("/mypage");
}

// 旅行を1件削除（/mypage の form action から呼ばれる）
export async function deleteTrip(id: string): Promise<void> {
  const { error } = await getSupabase().from("trips").delete().eq("id", id);
  if (error) {
    throw new Error(`削除に失敗しました: ${error.message}`);
  }
  revalidatePath("/mypage");
}
