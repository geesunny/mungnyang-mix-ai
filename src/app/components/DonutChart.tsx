'use client';

import { useMemo } from 'react';

type MixItem = { label: string; percent: number };

const ACCENTS = ['#FF8BA7', '#FFD166', '#7BDFF2'] as const;

interface DonutChartProps {
    data: MixItem[];
    size?: number;
    stroke?: number;
    showTopMatch?: boolean;
}

export default function DonutChart({ data, size = 140, stroke = 12, showTopMatch = true }: DonutChartProps) {
    if (!data.length) return null;

    const donut = useMemo(() => {
        const total = data.slice(0, 3).reduce((s, m) => s + m.percent, 0) || 1;
        const r = (size - stroke * 2) / 2;
        const C = 2 * Math.PI * r;

        let acc = 0;
        return data.slice(0, 3).map((m, i) => {
            const len = C * (m.percent / total);
            const seg = {
                dasharray: `${len} ${C - len}`,
                offset: -acc,
                color: ACCENTS[i % ACCENTS.length],
            };
            acc += len;
            return { ...seg, label: m.label, percent: Math.round(m.percent) };
        });
    }, [data, size, stroke]);

    const r = (size - stroke * 2) / 2;
    const topMix = donut[0];

    return (
        <div className="mb-4 flex items-center gap-4">
            {/* 도넛 */}
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <g transform={`translate(${size / 2}, ${size / 2})`}>
                    <circle r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
                    {donut.map(d => (
                        <circle
                            key={d.label}
                            r={r}
                            fill="none"
                            stroke={d.color}
                            strokeWidth={stroke}
                            strokeDasharray={d.dasharray}
                            strokeDashoffset={d.offset}
                            transform="rotate(-90)"
                            strokeLinecap="round"
                        />
                    ))}
                </g>
            </svg>

            {/* Top Match */}
            {showTopMatch && topMix && (
                <div>
                    <div className="text-[14px] font-semibold text-gray-500">Top Match</div>
                    <div className="mt-1 text-[20px] font-extrabold text-gray-900">{topMix.label}</div>
                    <div className="text-[16px] font-bold" style={{ color: ACCENTS[0] }}>
                        {topMix.percent}%
                    </div>
                </div>
            )}
        </div>
    );
}
