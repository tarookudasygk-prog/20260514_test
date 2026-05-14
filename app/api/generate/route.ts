// POST /api/generate … Claude API で宇宙旅行の体験テキストを生成する
import { NextResponse } from "next/server";
import { generateExperience } from "@/lib/claude";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  const { destination, apodTitle, apodExplanation } = (body ?? {}) as {
    destination?: unknown;
    apodTitle?: unknown;
    apodExplanation?: unknown;
  };

  if (typeof destination !== "string" || destination.trim() === "") {
    return NextResponse.json({ error: "destination は必須です" }, { status: 400 });
  }

  try {
    const text = await generateExperience({
      destination: destination.trim(),
      apodTitle: typeof apodTitle === "string" ? apodTitle : "",
      apodExplanation: typeof apodExplanation === "string" ? apodExplanation : "",
    });
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
