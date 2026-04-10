"use client";

import { useMemo, useState } from "react";

type WheelOption = {
  label: string;
  color: string;
};

const initialOptions: WheelOption[] = [
  { label: "Pizza", color: "#06b6d4" },
  { label: "Hambúrguer", color: "#8b5cf6" },
  { label: "Surpresa", color: "#fb7185" },
  { label: "Viagem", color: "#ec4899" },
  { label: "Filme", color: "#f59e0b" },
  { label: "Açaí", color: "#10b981" },
];

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

function slugColor(index: number) {
  const palette = ["#06b6d4", "#8b5cf6", "#fb7185", "#ec4899", "#f59e0b", "#10b981"];
  return palette[index % palette.length];
}

export default function HeroLiveWheel() {
  const [options, setOptions] = useState<WheelOption[]>(initialOptions);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [editing, setEditing] = useState(false);

  const safeOptions = useMemo(() => {
    const cleaned = options
      .map((item, index) => ({
        label: item.label.trim() || `Opção ${index + 1}`,
        color: item.color || slugColor(index),
      }))
      .filter(Boolean);

    return cleaned.length >= 2 ? cleaned.slice(0, 12) : initialOptions;
  }, [options]);

  const anglePerSlice = 360 / safeOptions.length;

  function updateOption(index: number, field: "label" | "color", value: string) {
    setOptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        label: `Opção ${prev.length + 1}`,
        color: slugColor(prev.length),
      },
    ]);
  }

  function removeOption(index: number) {
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length >= 2 ? next : prev;
    });
  }

  function pickWinner() {
    if (spinning || safeOptions.length < 2) return;

    const winnerIndex = Math.floor(Math.random() * safeOptions.length);
    const extraTurns = 7;
    const winnerCenterAngle = winnerIndex * anglePerSlice + anglePerSlice / 2;

    // Ajuste correto para o vencedor parar exatamente na seta do topo.
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const desiredNormalized = (360 - winnerCenterAngle) % 360;
    const delta = (desiredNormalized - currentNormalized + 360) % 360;
    const finalRotation = rotation + extraTurns * 360 + delta;

    setSpinning(true);
    setResult("");
    setRotation(finalRotation);

    window.setTimeout(() => {
      setResult(safeOptions[winnerIndex].label);
      setSpinning(false);
    }, 4200);
  }

  return (
    <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(6,182,212,0.10))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
          Roleta ao vivo
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
          Sorteio alinhado
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[560px]">
        <div className="pointer-events-none absolute left-1/2 top-[2px] z-20 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-b-[34px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_10px_25px_rgba(255,255,255,0.18)]" />

        <div className="rounded-full bg-black/65 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_15px_50px_rgba(0,0,0,0.6)]">
          <div className="rounded-full bg-black p-4">
            <div
              className="relative aspect-square w-full rounded-full border-[10px] border-black bg-[#14061f] shadow-[0_0_60px_rgba(0,0,0,0.5)]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)"
                  : "none",
              }}
            >
              <svg viewBox="0 0 500 500" className="h-full w-full rounded-full">
                {safeOptions.map((option, index) => {
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
                          filter="drop-shadow(0 8px 10px rgba(0,0,0,0.25))"
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
                <span className="select-none text-[18px] font-black uppercase tracking-tight">GIRAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          onClick={pickWinner}
          disabled={spinning}
          className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {spinning ? "Girando..." : "Girar agora"}
        </button>

        <button
          onClick={() => setEditing((prev) => !prev)}
          className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
        >
          {editing ? "Fechar edição" : "Editar demo"}
        </button>
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(6,182,212,0.18))] px-6 py-5 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="text-xs uppercase tracking-[0.4em] text-white/60">Resultado</div>
        <div className="mt-3 min-h-[56px] text-3xl font-black leading-tight md:text-5xl">
          {result ? `Resultado: ${result}` : "Agora a opção sorteada para exatamente na seta"}
        </div>
      </div>

      {editing ? (
        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">Editar demo da roleta</h3>
            <button
              onClick={addOption}
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              + Adicionar opção
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={`${index}-${option.label}`} className="grid gap-3 md:grid-cols-[1fr_110px_110px]">
                <input
                  value={option.label}
                  onChange={(e) => updateOption(index, "label", e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
                  placeholder={`Opção ${index + 1}`}
                />
                <input
                  type="color"
                  value={option.color}
                  onChange={(e) => updateOption(index, "color", e.target.value)}
                  className="h-[52px] w-full rounded-2xl border border-white/10 bg-black/30 px-2 py-2"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
