// GET /api/apod         … 本日の宇宙画像を返す
// GET /api/apod?random=1 … アーカイブからランダムな宇宙画像を返す
import { NextResponse } from "next/server";
import { getApod, randomApodDate } from "@/lib/nasa";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const random = searchParams.get("random");

  try {
    const date = random ? randomApodDate() : undefined;
    const apod = await getApod(date);
    return NextResponse.json(apod);
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
