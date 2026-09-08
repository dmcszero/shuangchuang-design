/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RadarDataPoint {
  label: string;
  value: number; // 0 to 10 scale
  benchmark: number; // Gold medal benchmark (e.g. 9.0)
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

export default function RadarChart({ data, size = 260 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.36;
  const numPoints = data.length;
  const angleStep = (Math.PI * 2) / numPoints;

  // Generate polygon points for web rings (at 20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, ratio: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + radius * ratio * Math.cos(angle);
    const y = center + radius * ratio * Math.sin(angle);
    return { x, y };
  };

  // Build polygon string for current score
  const currentPointsString = data
    .map((d, i) => {
      const ratio = Math.min(Math.max(d.value / 10, 0), 1);
      const coords = getCoordinates(i, ratio);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Build polygon string for Gold benchmark
  const benchmarkPointsString = data
    .map((d, i) => {
      const ratio = Math.min(Math.max(d.benchmark / 10, 0), 1);
      const coords = getCoordinates(i, ratio);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background Grid Rings */}
        {levels.map((level, lvlIdx) => {
          const points = data
            .map((_, i) => {
              const coords = getCoordinates(i, level);
              return `${coords.x},${coords.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvlIdx}
              points={points}
              fill={lvlIdx === levels.length - 1 ? '#F8FAFC' : 'transparent'}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '2 2'}
            />
          );
        })}

        {/* Axis Spokes from Center */}
        {data.map((_, i) => {
          const coords = getCoordinates(i, 1);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Gold Medal Benchmark Polygon (Gray/Amber dashed) */}
        <polygon
          points={benchmarkPointsString}
          fill="rgba(245, 158, 11, 0.08)"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Current Project Score Polygon (Blue fill & stroke) */}
        <polygon
          points={currentPointsString}
          fill="rgba(0, 113, 227, 0.22)"
          stroke="#0071E3"
          strokeWidth="2"
        />

        {/* Current Data Points Dots */}
        {data.map((d, i) => {
          const ratio = Math.min(Math.max(d.value / 10, 0), 1);
          const coords = getCoordinates(i, ratio);
          const isLow = d.value < 6.0;
          return (
            <g key={i}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4"
                fill={isLow ? '#EF4444' : '#0071E3'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Dimension Labels & Scores */}
        {data.map((d, i) => {
          const labelCoords = getCoordinates(i, 1.26);
          const isLow = d.value < 6.0;
          return (
            <g key={i} transform={`translate(${labelCoords.x}, ${labelCoords.y})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-medium fill-gray-700"
              >
                {d.label}
              </text>
              <text
                y="12"
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[9px] font-bold font-mono ${isLow ? 'fill-red-600' : 'fill-blue-600'}`}
              >
                {d.value.toFixed(1)} / 10
                {isLow && ' ⚠️'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center space-x-4 mt-2 text-[10px] text-gray-500 font-medium">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3] inline-block" />
          <span>智耘农业初稿 ({ (data.reduce((acc, curr) => acc + curr.value, 0) / data.length * 10).toFixed(1) }分)</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-0.5 border-b-2 border-dashed border-amber-500 inline-block" />
          <span>国赛金奖对标均线 (90分档)</span>
        </div>
      </div>
    </div>
  );
}
