// /mypage のサーバー側フェッチ（Supabase）待機中に表示されるスケルトン
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-40 rounded bg-slate-800" />

      <ul className="space-y-4">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
          >
            <div className="flex gap-4 p-5">
              <div className="hidden h-28 w-28 shrink-0 rounded-lg bg-slate-800 sm:block" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-800" />
                <div className="h-3 w-40 rounded bg-slate-800" />
                <div className="h-3 w-full rounded bg-slate-800" />
                <div className="h-3 w-4/5 rounded bg-slate-800" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
