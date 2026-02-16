"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

const formatPercent = (value) =>
  `${Math.round(Math.max(0, Math.min(1, value || 0)) * 100)}%`;

export default function PerformanceChart({
  data = [],
  color = "#2563eb",
  emptyLabel = "",
  height: forcedHeight,
}) {
  const gradientId = useId();
  const areaGradientId = `${gradientId}-area`;
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 900, height: 420 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({
        width: Math.max(300, rect.width),
        height: Math.max(260, rect.height),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const safeData = Array.isArray(data) ? data : [];
  const values = safeData.map((d) =>
    typeof d.value === "number" ? Math.max(0, d.value) : 0
  );
  const maxValue = Math.max(1, ...values);
  const width = size.width;
  const height = forcedHeight || size.height;
  const padding = 48;
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  const { coords, points, areaPath } = useMemo(() => {
    if (safeData.length === 0) return { coords: [], points: "", areaPath: "" };

    const computed = safeData.map((point, index) => {
      const x =
        padding +
        (index / Math.max(1, safeData.length - 1)) *
          (width - padding * 2);
      const value = typeof point.value === "number" ? point.value : 0;
      const y =
        height -
        padding -
        (value / maxValue) * (height - padding * 2);
      return { x, y, label: point.label, value };
    });

    const polyPoints = computed.map(({ x, y }) => `${x},${y}`).join(" ");

    const baseline = height - padding;
    const area =
      computed.length > 0
        ? [
            `M ${computed[0].x} ${baseline}`,
            ...computed.map(({ x, y }) => `L ${x} ${y}`),
            `L ${computed[computed.length - 1].x} ${baseline}`,
            "Z",
          ].join(" ")
        : "";

    return { coords: computed, points: polyPoints, areaPath: area };
  }, [safeData, width, height, padding, maxValue]);

  if (safeData.length === 0) {
    return (
      <div className="w-full h-full min-h-[320px] flex items-center justify-center text-secondary">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={forcedHeight ? { height: forcedHeight } : {}}
    >
      <svg
        className="w-full"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Performance chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridTicks.map((tick) => {
          const y =
            height -
            padding -
            (tick / Math.max(1, maxValue)) * (height - padding * 2);
          return (
            <g key={`grid-${tick}`}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1"
              />
              <text
                x={padding - 12}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.45)"
                fontSize="10"
              >
                {Math.round(tick * 100)}%
              </text>
            </g>
          );
        })}

        <line
          x1={padding}
          x2={padding}
          y1={padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {coords.map((point, index) => {
          const label = point.label || "";
          return (
            <text
              key={`xlabel-${index}`}
              x={point.x}
              y={height - padding + 22}
              textAnchor="middle"
              fill="rgba(255,255,255,0.45)"
              fontSize="10"
            >
              {label}
            </text>
          );
        })}

        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#${areaGradientId})`}
            stroke="none"
          />
        )}

        <polyline
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeOpacity="0.3"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />

        {coords.map((point, index) => {
          const { x, y } = point;
          return (
            <g key={`${point.label}-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#0f172a"
                stroke={color}
                strokeWidth="2"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && safeData[hoverIndex] && (
        <div
          className="absolute px-3 py-2 rounded-xl bg-primary border border-white/10 shadow-lg text-sm text-text"
          style={{
            left: `${(hoverIndex / Math.max(1, safeData.length - 1)) * 100}%`,
            bottom: "10%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold">{safeData[hoverIndex].label}</div>
          <div className="text-secondary">
            {safeData[hoverIndex].value !== null
              ? formatPercent(safeData[hoverIndex].value)
              : "--"}
          </div>
        </div>
      )}
    </div>
  );
}
