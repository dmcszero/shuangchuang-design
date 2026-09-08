import React, { useEffect, useState } from 'react';
import { DimensionScore } from './defenseTypes';

interface ScoreRingProps {
  score: number;
  size?: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, size = 132 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let color = '#e11d48'; // low: rose
  let badgeText = '需加强';
  let badgeClass = 'text-rose-700 bg-rose-50 border-rose-200';
  if (score >= 85) {
    color = '#10b981'; // excellent: emerald
    badgeText = '国金水准';
    badgeClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (score >= 75) {
    color = '#4f46e5'; // good: indigo
    badgeText = '省金优选';
    badgeClass = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  } else if (score >= 60) {
    color = '#f59e0b'; // medium: amber
    badgeText = '良好备选';
    badgeClass = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-out'
          }}
        />
      </svg>
      <div className="absolute text-center flex flex-col items-center">
        <span className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight font-mono">{score}</span>
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-1">综合评审分</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-1 ${badgeClass}`}>{badgeText}</span>
      </div>
    </div>
  );
};

interface RadarChartProps {
  data: DimensionScore[];
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 290 }) => {
  const center = size / 2;
  const radius = (size / 2) - 45; // room for labels
  const rings = 4;

  const getPoint = (value: number, index: number, max = 100) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const distance = (value / max) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  const dataPoints = data.map((d, i) => getPoint(d.value, i));
  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="overflow-visible mx-auto">
      {/* Grid Rings */}
      {[...Array(rings)].map((_, i) => {
        const ringRadius = (radius / rings) * (i + 1);
        const points = data.map((_, j) => {
          const angle = (Math.PI * 2 * j) / data.length - Math.PI / 2;
          return `${center + ringRadius * Math.cos(angle)},${center + ringRadius * Math.sin(angle)}`;
        }).join(' ');

        return (
          <polygon
            key={`ring-${i}`}
            points={points}
            fill={i === rings - 1 ? 'rgba(248, 250, 252, 0.6)' : 'none'}
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray={i < rings - 1 ? '3 3' : 'none'}
          />
        );
      })}

      {/* Axis Lines */}
      {data.map((_, i) => {
        const p = getPoint(100, i);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        );
      })}

      {/* Data Fill Polygon */}
      <path
        d={polygonPath}
        fill="rgba(99, 102, 241, 0.15)"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Data Points & Value Badges */}
      {data.map((d, i) => {
        const p = getPoint(d.value, i);
        const labelP = getPoint(120, i);

        let textAnchor = 'middle';
        if (labelP.x > center + 12) textAnchor = 'start';
        else if (labelP.x < center - 12) textAnchor = 'end';

        return (
          <g key={`data-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
            <text
              x={labelP.x}
              y={labelP.y - 6}
              fill="#475569"
              fontSize="11"
              fontWeight="600"
              textAnchor={textAnchor}
              alignmentBaseline="middle"
            >
              {d.label}
            </text>
            <text
              x={labelP.x}
              y={labelP.y + 8}
              fill="#0f172a"
              fontSize="12"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor={textAnchor}
              alignmentBaseline="middle"
            >
              {d.value}分
            </text>
          </g>
        );
      })}
    </svg>
  );
};
