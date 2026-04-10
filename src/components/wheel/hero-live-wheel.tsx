"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Slice = {
  label: string;
  color: string;
};

const slices: Slice[] = [
  { label: "Pizza", color: "#fb7185" },
  { label: "Hambúrguer", color: "#8b5cf6" },
  { label: "Filme", color: "#06b6d4" },
  { label: "Açaí", color: "#10b981" },
  { label: "Viagem", color: "#f59e0b" },
  { label: "Surpresa", color: "#ec4899" },
];

function pickWeightedIndex(length: number) {
  return Math.floor(Math.random() * length);
}

export default function HeroLiveWheel() {
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("Clique e veja a roleta em ação");
  const [spinning, setSpinning] = useState(false);

  const step = useMemo(() => 360 / slices.length, []);
  const labels = useMemo(
    () =>
      slices.map((slice, index) => {
        const angle = index * step + step / 2;
        return { ...slice, angle };
      }),
    [step]
  );

  function spin() {
    if (spinning) return;

    const winnerIndex = pickWeightedIndex(slices.length);
    const centerAngle = winnerIndex * step + step / 2;
    const normalizedTarget = 360 - centerAngle;
    const extraTurns = 360 * 6;
    const finalRotation = rotation + extraTurns + normalizedTarget + 360;

    setSpinning(true);
    setRotation(finalRotation);

    window.setTimeout(() => {
      setResult(`Resultado: ${slices[winnerIndex].label}`);
      setSpinning(false);
    }, 4200);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05010d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,70,239,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.18),_transparent_35%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-8 lg:pb-16 lg:pt-10">
        <section className="flex items-center py-4 sm:py-6 lg:py-0">
          <div className="w-full">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/75 backdrop-blur sm:text-xs">
              Roleta interativa
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.93] tracking-[-0.05em] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              Uma roleta chamativa,
              <span className="block bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-200 bg-clip-text text-transparent">
                viva e pronta
              </span>
              <span className="block text-white">para girar.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 sm:mt-6 sm:text-lg lg:text-[1.15rem]">
              Nada de layout com cara de clone. Aqui a pessoa entra e já vê a
              roleta funcionando, entende o produto em segundos e vai direto
              para criar a própria versão.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/create"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-black transition hover:scale-[1.02]"
              >
                Criar roleta agora
              </Link>
              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/10 bg-white/6 px-7 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {spinning ? "Girando..." : "Ver demo ao vivo"}
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3">
              <FeatureCard title="Uso" text="Decisões, sorteios e desafios" />
              <FeatureCard title="Acesso" text="Sem precisar login para entender" />
              <FeatureCard title="Impacto" text="Cara de produto mais premium" />
            </div>
          </div>
        </section>

        <section className="mt-8 flex items-center lg:mt-0 lg:justify-end">
          <div className="relative w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur sm:p-5 lg:max-w-[42rem] lg:rounded-[2.5rem] lg:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.16),_transparent_30%)] lg:rounded-[2.5rem]" />

            <div className="relative flex flex-wrap justify-center gap-2 pb-2 sm:justify-start">
              <Badge>Roleta ao vivo</Badge>
              <Badge>sem login para testar</Badge>
            </div>

            <div className="relative mt-3 flex flex-col items-center">
              <div className="relative flex w-full justify-center pb-4 sm:pb-5">
                <div className="absolute top-0 z-20 h-0 w-0 border-x-[16px] border-b-[28px] border-x-transparent border-b-white drop-shadow-[0_6px_16px_rgba(255,255,255,0.28)] sm:border-x-[18px] sm:border-b-[31px]" />

                <div className="relative mt-6 aspect-square w-full max-w-[24rem] sm:max-w-[27rem] lg:max-w-[30rem]">
                  <div className="absolute inset-0 rounded-full bg-black/80 shadow-[0_0_0_10px_rgba(255,255,255,0.07),0_0_0_18px_rgba(0,0,0,0.62)]" />

                  <div
                    className="absolute inset-[4.2%] rounded-full border border-white/8"
                    style={{
                      background: `conic-gradient(${slices
                        .map((slice, index) => {
                          const start = index * step;
                          const end = start + step;
                          return `${slice.color} ${start}deg ${end}deg`;
                        })
                        .join(", ")})`,
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning
                        ? "transform 4.2s cubic-bezier(0.12, 0.95, 0.12, 1)"
                        : "none",
                    }}
                  >
                    {labels.map((slice, index) => (
                      <div
                        key={`${slice.label}-${index}`}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: "42%",
                          transform: `translate(-50%, -50%) rotate(${slice.angle}deg)`,
                          transformOrigin: "center left",
                        }}
                      >
                        <span
                          className="absolute right-[13%] top-1/2 inline-flex -translate-y-1/2 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_6px_16px_rgba(0,0,0,0.28)] backdrop-blur sm:text-xs"
                          style={{ transform: `rotate(-${slice.angle}deg)` }}
                        >
                          {slice.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={spin}
                    disabled={spinning}
                    className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black text-lg font-black text-white shadow-[0_0_0_6px_rgba(255,255,255,0.05)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:h-28 sm:w-28"
                  >
                    GIRAR
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="mt-2 inline-flex min-h-14 w-full max-w-[15rem] items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {spinning ? "Girando agora..." : "Girar agora"}
              </button>

              <div className="mt-5 w-full rounded-[1.6rem] border border-white/10 bg-gradient-to-r from-white/[0.04] to-cyan-300/[0.12] px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6 sm:py-6">
                <div className="text-[11px] uppercase tracking-[0.38em] text-white/55 sm:text-xs">
                  Resultado
                </div>
                <div className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  {result}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur sm:px-5 sm:py-5">
      <div className="text-[11px] uppercase tracking-[0.32em] text-white/55 sm:text-xs">
        {title}
      </div>
      <div className="mt-3 text-xl font-bold leading-snug text-white sm:text-[1.7rem] lg:text-[1.6rem]">
        {text}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
      {children}
    </div>
  );
}
