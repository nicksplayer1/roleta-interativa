"use client";

import { useMemo, useRef, useState } from "react";

type DemoOption = {
  id: string;
  label: string;
  color: string;
};

const INITIAL_OPTIONS: DemoOption[] = [
  { id: "1", label: "Surpresa", color: "#fb7185" },
  { id: "2", label: "Viagem", color: "#ec4899" },
  { id: "3", label: "Filme", color: "#f59e0b" },
  { id: "4", label: "Açaí", color: "#10b981" },
  { id: "5", label: "Pizza", color: "#06b6d4" },
  { id: "6", label: "Hambúrguer", color: "#8b5cf6" },
];

export default function HeroLiveWheel() {
  const [options, setOptions] = useState<DemoOption[]>(INITIAL_OPTIONS);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>("Clique para girar");
  const editorRef = useRef<HTMLDivElement | null>(null);

  const safeOptions = useMemo(() => {
    const cleaned = options
      .map((item) => ({
        ...item,
        label: item.label.trim() || "Sem nome",
        color: item.color || "#8b5cf6",
      }))
      .filter(Boolean);

    return cleaned.length >= 2 ? cleaned.slice(0, 8) : INITIAL_OPTIONS;
  }, [options]);

  const angle = 360 / safeOptions.length;
  const size = 520;
  const center = size / 2;
  const radius = 230;

  function updateOption(id: string, field: "label" | "color", value: string) {
    setOptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addOption() {
    setOptions((prev) => {
      if (prev.length >= 8) return prev;
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          label: `Opção ${prev.length + 1}`,
          color: ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7"][prev.length % 5],
        },
      ];
    });
  }

  function removeOption(id: string) {
    setOptions((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }

  function spinWheel() {
    if (isSpinning) return;

    const winnerIndex = Math.floor(Math.random() * safeOptions.length);
    const winner = safeOptions[winnerIndex];
    const sliceCenter = winnerIndex * angle + angle / 2;
    const target = 360 - sliceCenter;
    const extraTurns = 360 * (5 + Math.floor(Math.random() * 2));
    const nextRotation = rotation + extraTurns + target;

    setIsSpinning(true);
    setResult("Girando...");
    setRotation(nextRotation);

    window.setTimeout(() => {
      setResult(`Resultado: ${winner.label}`);
      setIsSpinning(false);
    }, 4600);
  }

  function scrollToEditor() {
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_35%),linear-gradient(180deg,rgba(21,6,34,0.96),rgba(4,6,36,0.98))] p-5 shadow-[0_0_60px_rgba(59,130,246,0.14)] sm:p-6 lg:p-7">
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
          Roleta ao vivo
        </span>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
          edite e teste sem login
        </span>
      </div>

      <div className="mx-auto flex max-w-[620px] flex-col items-center">
        <div className="relative w-full max-w-[540px]">
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 drop-shadow-[0_6px_18px_rgba(255,255,255,0.28)]">
            <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-b-[30px] border-l-transparent border-r-transparent border-b-white" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[540px] rounded-full bg-black/80 p-5 shadow-[0_0_0_6px_rgba(255,255,255,0.05),0_0_0_16px_rgba(0,0,0,0.45)]">
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible rounded-full">
              <g
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "50% 50%",
                  transition: isSpinning ? "transform 4.6s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.25s ease",
                }}
              >
                {safeOptions.map((option, index) => {
                  const startAngle = index * angle;
                  const endAngle = (index + 1) * angle;
                  const middleAngle = startAngle + angle / 2;
                  const path = describeSlice(center, center, radius, startAngle, endAngle);
                  const labelPoint = polarToCartesian(center, center, radius * 0.62, middleAngle);
                  const labelRotation = middleAngle > 90 && middleAngle < 270 ? middleAngle + 180 : middleAngle;

                  return (
                    <g key={option.id}>
                      <path d={path} fill={option.color} stroke="rgba(10,10,20,0.28)" strokeWidth="1.2" />
                      <g transform={`translate(${labelPoint.x} ${labelPoint.y}) rotate(${labelRotation})`}>
                        <rect
                          x={-56}
                          y={-18}
                          rx={14}
                          width={112}
                          height={36}
                          fill="rgba(0,0,0,0.22)"
                          filter="drop-shadow(0px 6px 14px rgba(0,0,0,0.18))"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#ffffff"
                          fontSize="16"
                          fontWeight="700"
                          style={{ letterSpacing: "0.01em" }}
                        >
                          {truncate(option.label, 12)}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              <circle cx={center} cy={center} r="72" fill="rgba(10,10,14,0.96)" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
              <text
                x={center}
                y={center}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="24"
                fontWeight="900"
              >
                GIRAR
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-6 flex w-full max-w-[540px] flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={spinWheel}
              disabled={isSpinning}
              className="w-full rounded-full bg-white px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSpinning ? "Girando..." : "Girar agora"}
            </button>

            <button
              type="button"
              onClick={scrollToEditor}
              className="w-full rounded-full border border-white/15 bg-white/8 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/12"
            >
              Editar demo
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-cyan-300/15 bg-[linear-gradient(90deg,rgba(17,24,39,0.78),rgba(13,148,136,0.16))] px-5 py-4 text-center shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="mb-1 text-[11px] uppercase tracking-[0.35em] text-white/65">Resultado</div>
            <div className="text-2xl font-black text-white sm:text-3xl">{result}</div>
          </div>
        </div>
      </div>

      <div ref={editorRef} className="mt-7 rounded-[1.8rem] border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">Edite a roleta agora</h3>
            <p className="text-sm text-white/65">Troque nomes, cores, adicione ou remova opções sem precisar fazer login.</p>
          </div>
          <button
            type="button"
            onClick={addOption}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            + Adicionar
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => (
            <div key={option.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
                Opção {index + 1}
              </div>
              <div className="flex gap-2">
                <input
                  value={option.label}
                  onChange={(e) => updateOption(option.id, "label", e.target.value)}
                  placeholder={`Nome ${index + 1}`}
                  maxLength={18}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-300/35"
                />
                <input
                  type="color"
                  value={option.color}
                  onChange={(e) => updateOption(option.id, "color", e.target.value)}
                  className="h-[50px] w-[58px] rounded-2xl border border-white/10 bg-transparent p-1"
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeSlice(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${x} ${y}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
