"use client";

import { useMemo, useState } from "react";

type DemoOption = {
  label: string;
  color: string;
};

const DEMO_OPTIONS: DemoOption[] = [
  { label: "Pizza", color: "#ff6b6b" },
  { label: "Sushi", color: "#7c3aed" },
  { label: "Hambúrguer", color: "#06b6d4" },
  { label: "Açaí", color: "#10b981" },
  { label: "Filme", color: "#f59e0b" },
  { label: "Viagem", color: "#ec4899" },
];

function buildGradient(options: DemoOption[]) {
  const slice = 360 / options.length;
  return `conic-gradient(${options
    .map((option, index) => {
      const start = index * slice;
      const end = start + slice;
      return `${option.color} ${start}deg ${end}deg`;
    })
    .join(", ")})`;
}

export default function HeroLiveWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const options = DEMO_OPTIONS;
  const gradient = useMemo(() => buildGradient(options), [options]);

  function spinWheel() {
    if (spinning) return;

    const index = Math.floor(Math.random() * options.length);
    const slice = 360 / options.length;
    const sliceCenter = index * slice + slice / 2;
    const extraTurns = 360 * (6 + Math.floor(Math.random() * 3));
    const targetRotation = extraTurns + (360 - sliceCenter);

    setSpinning(true);
    setResult(null);
    setRotation((prev) => prev + targetRotation);

    window.setTimeout(() => {
      setResult(options[index].label);
      setSpinning(false);
    }, 4200);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 p-4 shadow-[0_0_100px_rgba(168,85,247,0.15)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_35%)]" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-zinc-300">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Roleta ao vivo</span>
          <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-fuchsia-200">
            sem login para testar
          </span>
        </div>

        <div className="relative flex items-center justify-center pt-3">
          <div className="absolute -top-1 z-20 h-0 w-0 border-l-[18px] border-r-[18px] border-b-[28px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_0_20px_rgba(255,255,255,0.55)]" />

          <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border-[10px] border-white/10 bg-zinc-950 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:h-[420px] sm:w-[420px]">
            <div
              className="relative h-full w-full rounded-full border-[8px] border-white/10 shadow-[inset_0_0_40px_rgba(255,255,255,0.08)]"
              style={{
                background: gradient,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.18, 1)"
                  : "transform 0.4s ease",
              }}
            >
              {options.map((option, index) => {
                const angle = (360 / options.length) * index;
                return (
                  <div
                    key={option.label}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-42%)`,
                      transformOrigin: "center center",
                    }}
                  >
                    <div
                      className="-translate-x-1/2 -translate-y-full rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md sm:text-xs"
                      style={{ transform: "rotate(90deg)" }}
                    >
                      {option.label}
                    </div>
                  </div>
                );
              })}

              <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/10 bg-black text-sm font-bold text-white shadow-[0_0_30px_rgba(255,255,255,0.15)] sm:h-20 sm:w-20 sm:text-base">
                GIRAR
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 text-center">
          <button
            type="button"
            onClick={spinWheel}
            disabled={spinning}
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {spinning ? "Girando..." : "Girar agora"}
          </button>

          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Resultado</p>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              {result ? result : "Clique e veja a roleta em ação"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
