\
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

const demoFallback: WheelOption[] = [
  { label: "Pizza", color: "#06b6d4" },
  { label: "Hambúrguer", color: "#8b5cf6" },
  { label: "Filme", color: "#f59e0b" },
  { label: "Viagem", color: "#ec4899" },
  { label: "Surpresa", color: "#fb7185" },
  { label: "Açaí", color: "#10b981" },
];

export default function PublicWheelPage() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [wheel, setWheel] = useState<WheelRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function loadWheel() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("wheels")
        .select("id, slug, title, description, cover_image_url, options, result_message, spin_seconds, is_public")
        .eq("slug", slug)
        .eq("is_public", true)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setError("Roleta não encontrada.");
        setWheel(null);
        setLoading(false);
        return;
      }

      setWheel(data as WheelRow);
      setLoading(false);
    }

    loadWheel();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const options = useMemo(() => {
    const items = Array.isArray(wheel?.options) && wheel?.options.length >= 2 ? wheel.options : demoFallback;
    return items
      .map((item) => ({
        label: (item?.label || "").trim() || "Opção",
        color: item?.color || "#8b5cf6",
      }))
      .slice(0, 12);
  }, [wheel]);

  const anglePerSlice = 360 / options.length;

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
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

  function getLabelPosition(index: number, radius: number) {
    const centerAngle = index * anglePerSlice + anglePerSlice / 2;
    const point = polarToCartesian(radius, radius, radius * 0.63, centerAngle);
    return { point, angle: centerAngle };
  }

  function pickWinner() {
    if (spinning || options.length < 2) return;

    const winnerIndex = Math.floor(Math.random() * options.length);
    const extraTurns = 7;
    const targetAngle = 360 - (winnerIndex * anglePerSlice + anglePerSlice / 2);
    const finalRotation = rotation + extraTurns * 360 + targetAngle;

    setSpinning(true);
    setResult("");
    setRotation(finalRotation);

    const ms = Math.max(2500, (wheel?.spin_seconds || 4) * 1000);

    window.setTimeout(() => {
      setResult(options[winnerIndex].label);
      setSpinning(false);
    }, ms);
  }

  async function copyLink() {
    if (typeof window === "undefined") return;
    await navigator.clipboard.writeText(window.location.href);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050114] px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center text-lg">
          Carregando roleta...
        </div>
      </main>
    );
  }

  if (error || !wheel) {
    return (
      <main className="min-h-screen bg-[#050114] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-2xl font-semibold">{error || "Roleta não encontrada."}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-white/15 bg-white px-6 py-3 font-semibold text-black"
          >
            Voltar para a home
          </Link>
        </div>
      </main>
    );
  }

  const resultPrefix = wheel.result_message?.trim() || "Resultado:";
  const finalText = result ? `${resultPrefix.replace(/:$/, "")}: ${result}` : "Clique e veja a roleta em ação";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050114] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.18),_transparent_30%)]" />

      <section className="relative mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
          >
            Roleta Interativa
          </Link>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyLink}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
            >
              Copiar link
            </button>
            <Link
              href="/create"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Criar a minha
            </Link>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-8">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
              Roleta pública
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-6xl">
              {wheel.title}
            </h1>

            {wheel.description ? (
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-xl">
                {wheel.description}
              </p>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.34em] text-white/45">Opções</div>
                <div className="mt-3 text-3xl font-black">{options.length}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.34em] text-white/45">Tempo</div>
                <div className="mt-3 text-3xl font-black">{wheel.spin_seconds || 4}s</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.34em] text-white/45">Acesso</div>
                <div className="mt-3 text-xl font-black">Público por link</div>
              </div>
            </div>

            {wheel.cover_image_url ? (
              <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <img
                  src={wheel.cover_image_url}
                  alt={wheel.title}
                  className="h-[240px] w-full object-cover md:h-[320px]"
                />
              </div>
            ) : null}
          </div>

          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(6,182,212,0.10))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Demo ao vivo
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                Girar sem login
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="pointer-events-none absolute left-1/2 top-[6px] z-20 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-b-[34px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_10px_25px_rgba(255,255,255,0.18)]" />

              <div className="rounded-full bg-black/65 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_15px_50px_rgba(0,0,0,0.6)]">
                <div className="rounded-full bg-black p-4">
                  <div
                    className="relative aspect-square w-full rounded-full border-[10px] border-black bg-[#14061f] shadow-[0_0_60px_rgba(0,0,0,0.5)]"
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
                        const label = getLabelPosition(index, 250);

                        return (
                          <g key={`${option.label}-${index}`}>
                            <path d={createSlicePath(startAngle, endAngle, 250)} fill={option.color} opacity={0.98} />
                            <g transform={`translate(${label.point.x}, ${label.point.y}) rotate(${label.angle})`}>
                              <rect
                                x={-46}
                                y={-14}
                                rx={12}
                                ry={12}
                                width={92}
                                height={28}
                                fill="rgba(0,0,0,0.25)"
                                filter="drop-shadow(0 8px 10px rgba(0,0,0,0.25))"
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#ffffff"
                                fontSize="13"
                                fontWeight="800"
                              >
                                {option.label.length > 12 ? `${option.label.slice(0, 12)}…` : option.label}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>

                    <div className="absolute left-1/2 top-1/2 z-10 flex h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-white/10 bg-black shadow-[0_15px_40px_rgba(0,0,0,0.55)]">
                      <span className="select-none text-[18px] font-black uppercase tracking-tight">GIRAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={pickWinner}
                disabled={spinning}
                className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {spinning ? "Girando..." : "Girar agora"}
              </button>

              <Link
                href={`/create?from=${wheel.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Criar parecida
              </Link>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(6,182,212,0.18))] px-6 py-5 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="text-xs uppercase tracking-[0.4em] text-white/60">Resultado</div>
              <div className="mt-3 min-h-[56px] text-3xl font-black leading-tight md:text-5xl">
                {finalText}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
