"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type WheelOption = {
  label: string;
  color: string;
};

type WheelRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  options: WheelOption[] | null;
  result_message: string | null;
  spin_seconds: number;
  is_public: boolean;
};

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createSlicePath(startAngle: number, endAngle: number, radius: number) {
  const start = polarToCartesian(radius, radius, radius, endAngle);
  const end = polarToCartesian(radius, radius, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${radius} ${radius}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function PublicWheelPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [wheel, setWheel] = useState<WheelRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function loadWheel() {
      setLoading(true);

      const { data } = await supabase
        .from("wheels")
        .select("id, slug, title, description, cover_image_url, options, result_message, spin_seconds, is_public")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

      if (cancelled) return;

      setWheel((data as WheelRow) || null);
      setLoading(false);
    }

    loadWheel();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const options = useMemo(() => {
    const raw = Array.isArray(wheel?.options) ? wheel.options : [];
    return raw.length >= 2 ? raw.slice(0, 12) : [];
  }, [wheel]);

  const anglePerSlice = options.length > 0 ? 360 / options.length : 0;

  function pickWinner() {
    if (spinning || options.length < 2) return;

    const winnerIndex = Math.floor(Math.random() * options.length);
    const extraTurns = 7;
    const winnerCenterAngle = winnerIndex * anglePerSlice + anglePerSlice / 2;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const desiredNormalized = (360 - winnerCenterAngle) % 360;
    const delta = (desiredNormalized - currentNormalized + 360) % 360;
    const finalRotation = rotation + extraTurns * 360 + delta;

    setSpinning(true);
    setResult("");
    setRotation(finalRotation);

    window.setTimeout(() => {
      setResult(options[winnerIndex].label);
      setSpinning(false);
    }, Math.max(2500, (wheel?.spin_seconds || 4) * 1000));
  }

  async function copyLink() {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050114] px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-[34px] border border-white/10 bg-white/5 p-8 text-center text-lg">
          Carregando roleta...
        </div>
      </main>
    );
  }

  if (!wheel || options.length < 2) {
    return (
      <main className="min-h-screen bg-[#050114] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-[34px] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-black">Roleta não encontrada</h1>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black"
          >
            Voltar para a home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050114] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.16),_transparent_30%)]" />

      <section className="relative mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
            Roleta para girar
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyLink}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copied ? "Link copiado" : "Copiar link"}
            </button>

            <Link
              href="/create?mode=send"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Criar uma para enviar
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,#16051f_0%,#090316_55%,#071427_100%)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-8">
            <h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">{wheel.title}</h1>

            {wheel.description ? (
              <p className="mt-5 text-lg leading-8 text-white/80">{wheel.description}</p>
            ) : null}

            {wheel.cover_image_url ? (
              <img
                src={wheel.cover_image_url}
                alt={wheel.title}
                className="mt-6 h-56 w-full rounded-[28px] object-cover md:h-72"
              />
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Opções</div>
                <div className="mt-2 text-2xl font-black">{options.length}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Tempo</div>
                <div className="mt-2 text-2xl font-black">{wheel.spin_seconds || 4}s</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.32em] text-white/45">Modo</div>
                <div className="mt-2 text-2xl font-black">Só girar</div>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(6,182,212,0.10))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Público por link
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Edição bloqueada
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="pointer-events-none absolute left-1/2 top-[6px] z-20 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-t-[34px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_10px_25px_rgba(255,255,255,0.18)]" />

              <div className="rounded-full bg-black/70 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_15px_50px_rgba(0,0,0,0.6)]">
                <div className="rounded-full bg-black p-4">
                  <div
                    className="relative aspect-square w-full rounded-full border-[10px] border-black bg-[#14061f]"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning
                        ? `transform ${Math.max(2.5, wheel.spin_seconds || 4)}s cubic-bezier(0.15, 0.9, 0.2, 1)`
                        : "none",
                    }}
                  >
                    <svg viewBox="0 0 500 500" className="h-full w-full rounded-full">
                      {options.map((option, index) => {
                        const startAngle = index * anglePerSlice;
                        const endAngle = (index + 1) * anglePerSlice;
                        const centerAngle = startAngle + anglePerSlice / 2;
                        const point = polarToCartesian(250, 250, 162, centerAngle);
                        const pillWidth = Math.max(78, Math.min(132, option.label.length * 10));

                        return (
                          <g key={`${option.label}-${index}`}>
                            <path
                              d={createSlicePath(startAngle, endAngle, 250)}
                              fill={option.color}
                              opacity={0.98}
                              stroke="rgba(0,0,0,0.22)"
                              strokeWidth="1"
                            />
                            <g transform={`translate(${point.x}, ${point.y})`}>
                              <rect
                                x={-pillWidth / 2}
                                y={-17}
                                rx={14}
                                ry={14}
                                width={pillWidth}
                                height={34}
                                fill="rgba(0,0,0,0.22)"
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#ffffff"
                                fontSize="13"
                                fontWeight="800"
                              >
                                {option.label.length > 14 ? `${option.label.slice(0, 14)}…` : option.label}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>

                    <div className="absolute left-1/2 top-1/2 z-10 flex h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-white/10 bg-black shadow-[0_15px_40px_rgba(0,0,0,0.55)]">
                      <span className="select-none text-[18px] font-black uppercase tracking-tight text-white">GIRAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={pickWinner}
                disabled={spinning}
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {spinning ? "Girando..." : "Girar agora"}
              </button>
            </div>

            <div className="mt-5 rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(6,182,212,0.18))] px-6 py-5 text-center">
              <div className="text-xs uppercase tracking-[0.4em] text-white/65">Resultado</div>
              <div className="mt-3 min-h-[56px] text-3xl font-black leading-tight text-white md:text-5xl">
                {result
                  ? `${(wheel.result_message || "Resultado:").replace(/:$/, "")}: ${result}`
                  : "Gire a roleta para ver o resultado"}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
