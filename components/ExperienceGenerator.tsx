"use client";

import { useState } from "react";
import type { Apod } from "@/lib/nasa";
import ApodCard from "@/components/ApodCard";
import { saveTrip } from "@/app/actions/trips";

const SUGGESTED_DESTINATIONS = [
  "月の裏側",
  "土星のリング",
  "火星のオリンポス山",
  "木星の大赤斑",
  "アンドロメダ銀河",
];

export default function ExperienceGenerator({
  initialApod,
}: {
  initialApod: Apod;
}) {
  const [apod, setApod] = useState<Apod>(initialApod);
  const [destination, setDestination] = useState("");
  const [experience, setExperience] = useState("");
  const [loadingApod, setLoadingApod] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function loadNewImage() {
    setLoadingApod(true);
    setError("");
    try {
      const res = await fetch("/api/apod?random=1");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "画像の取得に失敗しました");
      setApod(data as Apod);
      setExperience("");
      setSaved(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoadingApod(false);
    }
  }

  async function generate() {
    if (!destination.trim()) {
      setError("行き先を入力してください");
      return;
    }
    setGenerating(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          apodTitle: apod.title,
          apodExplanation: apod.explanation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "体験テキストの生成に失敗しました");
      setExperience(data.text as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setGenerating(false);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      await saveTrip({
        destination,
        apodTitle: apod.title,
        apodUrl: apod.url,
        apodDate: apod.date,
        experienceText: experience,
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">宇宙を探索する</h1>
        <button
          onClick={loadNewImage}
          disabled={loadingApod}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {loadingApod ? "読み込み中…" : "別の画像にする 🎲"}
        </button>
      </div>

      <ApodCard apod={apod} />

      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <label className="block text-sm font-medium text-slate-200">
          行き先を入力
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例：土星のリング"
            className="mt-1.5 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_DESTINATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDestination(d)}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-800"
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={generating}
          className="w-full rounded-md bg-indigo-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {generating ? "体験記を生成中…" : "✨ 宇宙旅行の体験記を生成"}
        </button>
      </div>

      {error && (
        <p className="rounded-md border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {experience && (
        <div className="space-y-4 rounded-xl border border-indigo-900 bg-indigo-950/30 p-5">
          <h2 className="font-semibold text-indigo-200">
            「{destination}」への旅行体験記
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
            {experience}
          </p>
          <button
            onClick={save}
            disabled={saving || saved}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            {saved ? "保存しました ✓" : saving ? "保存中…" : "💾 マイページに保存"}
          </button>
        </div>
      )}
    </div>
  );
}
