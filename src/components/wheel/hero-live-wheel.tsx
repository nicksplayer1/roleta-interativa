"use client";

import { useMemo, useState } from "react";

type DemoOption = {
  label: string;
  color: string;
};

const DEMO_OPTIONS: DemoOption[] = [
  { label: "Viagem", color: "#ec4899" },
  { label: "Surpresa", color: "#fb7185" },
  { label: "Hambúrguer", color: "#8b5cf6" },
  { label: "Pizza", color: "#06b6d4" },
  { label: "Açaí", color: "#10b981" },
  { label: "Filme", color: "#f59e0b" },
];

const WHEEL_SIZE = 560;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 230;
const LABEL_RADIUS = 146;

export default function HeroLiveWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("Clique e veja a roleta em ação");

  const sliceAngle = 360 / DEMO_OPTIONS.length;

  const labels = useMemo(
    () =>
      DEMO_OPTIONS.map((option, index) => {
        const centerAngle = index * sliceAngle + sliceAngle / 2;
        const point = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, centerAngle - 90);

        let labelRotation = centerAngle;
        if (labelRotation > 90 && labelRotation < 270) {
          labelRotation += 180;
        }

        return {
          ...option,
          x: point.x,
          y: point.y,
          rotation: labelRotation,
          text: truncate(option.label, 12),
        };
      }),
    [sliceAngle]
  );

  function spinWheel() {
    if (spinning) return;

    const winnerIndex = Math.floor(Math.random() * DEMO_OPTIONS.length);
    const fullTurns = 360 * (5 + Math.floor(Math.random() * 2));
    const landingAngle = (360 - (winnerIndex * sliceAngle + sliceAngle / 2)) % 360;
    const nextRotation = rotation + fullTurns + landingAngle + Math.random() * (sliceAngle * 0.35);

    setSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setResult(`Resultado: ${DEMO_OPTIONS[winnerIndex].label}`);
      setSpinning(false);
    }, 4700);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.18),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(6,182,212,0.22),_transparent_30%),linear-gradient(180deg,rgba(20,8,30,0.95),rgba(5,8,28,0.98))] p-5 shadow-[0_0_80px_rgba(0,0,0,0.35)] sm:p-6 lg:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
          Roleta ao vivo
        </span>
        <span className="rounded-full border border-fuchsia-300/15 bg-fuchsia-200/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
          nomes alinhados e limpos
        </span>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative flex w-full justify-center">
          <div className="absolute top-3 z-20 h-0 w-0 border-l-[18px] border-r-[18px] border-b-[32px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_8px_20px_rgba(255,255,255,0.22)]" />

          <div className="relative aspect-square w-full max-w-[520px] rounded-full p-3 sm:p-4">
            <div className="absolute inset-0 rounded-full bg-black/55 shadow-[inset_0_0_0_10px_rgba(255,255,255,0.05)]" />
            <div className="absolute inset-[10px] rounded-full bg-black/88 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06)]" />

            <svg
              viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              className="relative z-10 h-full w-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4.7s cubic-bezier(0.16, 1, 0.3, 1)"
                  : "transform 0.4s ease-out",
              }}
            >
              {DEMO_OPTIONS.map((option, index) => {
                const startAngle = index * sliceAngle - 90;
                const endAngle = startAngle + sliceAngle;

                return (
                  <path
                    key={`slice-${option.label}-${index}`}
                    d={createSlicePath(startAngle, endAngle)}
                    fill={option.color}
                    opacity={0.98}
                  />
                );
              })}

              {labels.map((option, index) => {
                const pillWidth = Math.max(70, Math.min(120, option.text.length * 10 + 28));

                return (
                  <g
                    key={`label-${option.label}-${index}`}
                    transform={`translate(${option.x} ${option.y}) rotate(${option.rotation})`}
                  >
                    <rect
                      x={-pillWidth / 2}
                      y={-18}
                      rx={16}
                      ry={16}
                      width={pillWidth}
                      height={36}
                      fill="rgba(17,24,39,0.34)"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1.25"
                      filter="drop-shadow(0 8px 14px rgba(0,0,0,0.18))"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="20"
                      fontWeight="700"
                      letterSpacing="0"
                    >
                      {option.text}
                    </text>
                  </g>
                );
              })}

              <circle cx={CENTER} cy={CENTER} r="64" fill="rgba(0,0,0,0.94)" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
              <circle cx={CENTER} cy={CENTER} r="71" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <text
                x={CENTER}
                y={CENTER + 6}
                textAnchor="middle"
                fill="white"
                fontSize="40"
                fontWeight="800"
                letterSpacing="1"
              >
                GIRAR
              </text>
            </svg>
          </div>
        </div>

        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          className="inline-flex min-h-[60px] items-center justify-center rounded-full bg-white px-8 text-lg font-semibold text-black shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[240px]"
        >
          {spinning ? "Girando..." : "Girar agora"}
        </button>

        <div className="w-full rounded-[1.75rem] border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(34,211,238,0.16))] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-8">
          <p className="mb-2 text-xs uppercase tracking-[0.45em] text-white/60">Resultado</p>
          <p className="text-3xl font-black leading-tight text-white sm:text-4xl">{result}</p>
        </div>
      </div>
    </section>
  );
}

function createSlicePath(startAngle: number, endAngle: number) {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
