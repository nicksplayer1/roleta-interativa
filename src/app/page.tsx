"use client";

import Link from "next/link";
import HeroLiveWheel from "@/components/wheel/hero-live-wheel";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050114] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.16),_transparent_30%)]" />

      <section className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="pt-4">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
              Roleta Interativa
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.05em] md:text-7xl">
              Uma roleta chamativa, viva e pronta para girar.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              A pessoa entra e já entende tudo. Você pode só brincar com a demo
              ou criar uma roleta própria para enviar para outra pessoa girar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
              >
                Criar roleta agora
              </Link>

              <a
                href="#demo"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Ver demo ao vivo
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Uso</div>
                <div className="mt-3 text-2xl font-black">Decisões, sorteios e desafios</div>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Envio</div>
                <div className="mt-3 text-2xl font-black">Você cria e a outra pessoa só gira</div>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Visual</div>
                <div className="mt-3 text-2xl font-black">Cara forte, simples e vendável</div>
              </div>
            </div>
          </div>

          <div id="demo">
            <HeroLiveWheel />
          </div>
        </div>
      </section>

      <Link
        href="/create?mode=send"
        className="fixed bottom-5 right-5 z-50 rounded-full border border-cyan-400/20 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(6,182,212,0.18))] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur transition hover:scale-[1.02] hover:bg-white/10 md:px-6 md:text-base"
      >
        Criar roleta para enviar
      </Link>
    </main>
  );
}
