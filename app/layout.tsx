import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "宇宙旅行シミュレーター",
  description: "NASA APOD と Claude API で宇宙旅行を疑似体験する Web アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-10 pt-4 text-center text-xs text-slate-500">
          Powered by NASA APOD &amp; Claude API
        </footer>
      </body>
    </html>
  );
}
