"use client";

import Link from "next/link";
import HeroLiveWheel from "@/components/wheel/hero-live-wheel";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050114] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.16),_transparent_30%)]" />

      <section className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
            Roleta Interativa
          </div>

          <Link
            href="/create?mode=send"
            className="rounded-full border border-cyan-400/30 bg-[linear-gradient(90deg,rgba(236,72,153,0.22),rgba(6,182,212,0.24))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur transition hover:scale-[1.02] md:px-6 md:text-base"
          >
            Criar roleta para enviar
          </Link>
        </div>

        <HeroLiveWheel />
      </section>
    </main>
  );
}
