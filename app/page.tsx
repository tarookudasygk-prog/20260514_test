import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-10 py-12 text-center">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-r from-indigo-300 via-sky-200 to-purple-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          宇宙旅行シミュレーター
        </h1>
        <p className="mx-auto max-w-xl text-slate-300">
          NASA の「今日の宇宙画像」と Claude AI を組み合わせて、
          あなただけの宇宙旅行体験記を生成します。気に入った旅は保存して、
          マイページでいつでも読み返せます。
        </p>
      </div>

      <Link
        href="/explore"
        className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-900/50 transition-colors hover:bg-indigo-500"
      >
        旅をはじめる →
      </Link>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        {[
          {
            icon: "🛰️",
            title: "NASA の本物の宇宙画像",
            desc: "APOD API から実際の天体写真を取得します。",
          },
          {
            icon: "✨",
            title: "AI が体験記を執筆",
            desc: "Claude が臨場感あふれる旅行記を書き上げます。",
          },
          {
            icon: "💾",
            title: "お気に入りを保存",
            desc: "Supabase に保存してマイページで振り返り。",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left"
          >
            <div className="text-2xl">{card.icon}</div>
            <h2 className="mt-2 font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
