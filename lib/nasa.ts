// NASA APOD（Astronomy Picture of the Day）API ラッパー

export type Apod = {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  media_type: "image" | "video" | string;
  copyright?: string;
};

// APOD から画像を1件取得する。date を渡すとその日の画像を返す。
export async function getApod(date?: string): Promise<Apod> {
  // APIキーが未設定でも DEMO_KEY で動く（ただしレート制限が厳しい）
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const params = new URLSearchParams({ api_key: apiKey });
  if (date) params.set("date", date);

  const res = await fetch(`https://api.nasa.gov/planetary/apod?${params.toString()}`, {
    // 同じ日付の画像は1時間キャッシュする
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`NASA API エラー (${res.status})`);
  }

  return (await res.json()) as Apod;
}

// APOD のアーカイブ（1996年以降）からランダムな日付を返す
export function randomApodDate(): string {
  const start = new Date("1996-01-01").getTime();
  const end = Date.now();
  const t = start + Math.random() * (end - start);
  return new Date(t).toISOString().slice(0, 10);
}
