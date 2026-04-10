"use client";

import { WheelOption } from "@/types/wheel";

type Props = {
  options: WheelOption[];
};

export default function WheelPreview({ options }: Props) {
  const safeOptions = options.length > 0 ? options : [{ label: "Sem opções", color: "#94a3b8" }];
  const size = 320;
  const radius = size / 2;
  const angle = 360 / safeOptions.length;

  const createSlicePath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, radius, radius, endAngle);
    const end = polarToCartesian(radius, radius, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${radius} ${radius}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute left-1/2 top-[-8px] z-10 h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-0 border-b-[18px] border-l-transparent border-r-transparent border-b-black" />
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
          {safeOptions.map((option, index) => {
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;
            const textAngle = startAngle + angle / 2;
            const textPoint = polarToCartesian(radius, radius, radius * 0.62, textAngle);

            return (
              <g key={`${option.label}-${index}`}>
                <path d={createSlicePath(startAngle, endAngle)} fill={option.color} stroke="#fff" strokeWidth="2" />
                <text
                  x={textPoint.x}
                  y={textPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#fff"
                  transform={`rotate(${textAngle} ${textPoint.x} ${textPoint.y})`}
                >
                  {option.label.slice(0, 14)}
                </text>
              </g>
            );
          })}
          <circle cx={radius} cy={radius} r="20" fill="#111827" />
        </svg>
      </div>
    </div>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}