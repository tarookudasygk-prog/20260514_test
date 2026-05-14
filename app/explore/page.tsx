import ExperienceGenerator from "@/components/ExperienceGenerator";
import { getApod } from "@/lib/nasa";

// このページはリクエストごとに最新の APOD を取得する
export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  try {
    // サーバーコンポーネントで初期画像を取得し、クライアントコンポーネントに渡す
    const apod = await getApod();
    return <ExperienceGenerator initialApod={apod} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラー";
    return (
      <div className="rounded-md border border-red-900 bg-red-950/50 px-4 py-6 text-sm text-red-300">
        <p className="font-semibold">宇宙画像の取得に失敗しました</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2 text-red-400">
          NASA_API_KEY が正しく設定されているか確認してください。
        </p>
      </div>
    );
  }
}
