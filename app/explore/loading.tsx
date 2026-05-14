// /explore のサーバー側フェッチ（NASA APOD）待機中に表示されるスケルトン
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="h-9 w-32 rounded-md bg-slate-800" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="h-72 w-full bg-slate-800" />
        <div className="space-y-3 p-5">
          <div className="h-5 w-2/3 rounded bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-800" />
          <div className="h-3 w-5/6 rounded bg-slate-800" />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="h-10 w-full rounded-md bg-slate-800" />
        <div className="h-11 w-full rounded-md bg-slate-800" />
      </div>
    </div>
  );
}
