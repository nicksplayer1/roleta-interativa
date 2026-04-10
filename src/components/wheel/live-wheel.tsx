"use client";

import { useMemo, useState } from "react";
import type { WheelOption } from "@/types/wheel";

type Props = {
  title: string;
  options: WheelOption[];
  resultMessage?: string | null;
  spinSeconds?: number;
};

type SpinResult = {
  index: number;
  label: string;
};

export default function LiveWheel({
  title,
  options,
  resultMessage,
  spinSeconds = 4,
}: Props) {
  const safeOptions = useMemo(() => {
    if (options.length >= 2) return options;

    return [
      { label: "Opção 1", color: "#3b82f6" },
      { label: "Opção 2", color: "#8b5cf6" },
    ];
  }, [options]);

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);

  const size = 360;
  const radius = size / 2;
  const angle = 360 / safeOptions.length;

  function polarToCartesian(
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  }

  function createSlicePath(startAngle: number, endAngle: number) {
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

  function handleSpin() {
    if (isSpinning || safeOptions.length < 2) return;

    const chosenIndex = Math.floor(Math.random() * safeOptions.length);
    const chosen = safeOptions[chosenIndex];
    const centerAngle = chosenIndex * angle + angle / 2;
    const turns = Math.max(6, spinSeconds + 3);
    const nextRotation = rotation + turns * 360 + (360 - centerAngle);

    setIsSpinning(true);
    setResult(null);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setResult({ index: chosenIndex, label: chosen.label });
      setIsSpinning(false);
    }, spinSeconds * 1000 + 80);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-5">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute left-1/2 top-[-10px] z-20 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-gray-950 drop-shadow-md" />

          <div className="relative rounded-full bg-white p-3 shadow-2xl ring-1 ring-black/5">
            <div
              className="relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? `transform ${spinSeconds}s cubic-bezier(0.16, 1, 0.3, 1)`
                  : "none",
              }}
            >
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="drop-shadow-lg"
              >
                {safeOptions.map((option, index) => {
                  const startAngle = index * angle;
                  const endAngle = (index + 1) * angle;
                  const textAngle = startAngle + angle / 2;
                  const textPoint = polarToCartesian(
                    radius,
                    radius,
                    radius * 0.65,
                    textAngle
                  );

                  return (
                    <g key={`${option.label}-${index}`}>
                      <path
                        d={createSlicePath(startAngle, endAngle)}
                        fill={option.color || "#3b82f6"}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={textPoint.x}
                        y={textPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill="#ffffff"
                        transform={`rotate(${textAngle} ${textPoint.x} ${textPoint.y})`}
                      >
                        {option.label.length > 16
                          ? `${option.label.slice(0, 16)}...`
                          : option.label}
                      </text>
                    </g>
                  );
                })}

                <circle cx={radius} cy={radius} r="24" fill="#111827" />
                <circle cx={radius} cy={radius} r="9" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSpinning ? "Girando..." : "Girar agora"}
        </button>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-5 text-center shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
          Resultado
        </p>

        <div className="mt-3 min-h-[72px]">
          {result ? (
            <>
              <p className="text-sm text-gray-500">
                {resultMessage?.trim() || "Resultado sorteado:"}
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950">
                {result.label}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-900">{title}</p>
              <p className="mt-2 text-sm text-gray-500">
                Clique em girar para sortear uma opção.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
