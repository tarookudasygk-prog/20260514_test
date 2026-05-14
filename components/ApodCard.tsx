import type { Apod } from "@/lib/nasa";

export default function ApodCard({ apod }: { apod: Apod }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      {apod.media_type === "image" ? (
        // next/image を使わず通常の img タグを使用（リモートドメイン設定が不要でコピペで動く）
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apod.url}
          alt={apod.title}
          className="max-h-[480px] w-full object-cover"
        />
      ) : (
        <div className="flex h-60 items-center justify-center bg-slate-800 text-sm text-slate-300">
          <a
            href={apod.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            動画コンテンツを開く ↗
          </a>
        </div>
      )}
      <div className="space-y-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">{apod.title}</h2>
          <span className="shrink-0 text-xs text-slate-500">{apod.date}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          {apod.explanation}
        </p>
        {apod.copyright && (
          <p className="text-xs text-slate-600">© {apod.copyright}</p>
        )}
      </div>
    </div>
  );
}
