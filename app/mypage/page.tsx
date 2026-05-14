import Link from "next/link";
import { getTrips, deleteTrip } from "@/app/actions/trips";

// 保存内容を常に最新で表示する
export const dynamic = "force-dynamic";

export default async function MyPage() {
  let trips;
  try {
    trips = await getTrips();
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明なエラー";
    return (
      <div className="rounded-md border border-red-900 bg-red-950/50 px-4 py-6 text-sm text-red-300">
        <p className="font-semibold">保存データの読み込みに失敗しました</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2 text-red-400">
          Supabase の環境変数と trips テーブルが作成されているか確認してください。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      {trips.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
          <p>まだ保存された宇宙旅行はありません。</p>
          <Link
            href="/explore"
            className="mt-3 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            探索ページへ →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
            >
              <div className="flex gap-4 p-5">
                {trip.apod_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trip.apod_url}
                    alt={trip.apod_title ?? ""}
                    className="hidden h-28 w-28 shrink-0 rounded-lg object-cover sm:block"
                  />
                )}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold text-indigo-200">
                      {trip.destination}
                    </h2>
                    <span className="shrink-0 text-xs text-slate-500">
                      {new Date(trip.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  {trip.apod_title && (
                    <p className="text-xs text-slate-500">
                      宇宙画像: {trip.apod_title}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                    {trip.experience_text}
                  </p>
                  <form action={deleteTrip.bind(null, trip.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-900 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-950"
                    >
                      削除
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
