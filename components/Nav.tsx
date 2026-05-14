"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/explore", label: "探索" },
  { href: "/mypage", label: "マイページ" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          🚀 宇宙旅行シミュレーター
        </Link>
        <ul className="flex gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
