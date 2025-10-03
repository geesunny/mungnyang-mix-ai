'use client';

import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useMemo, useRef, useState } from 'react';
import ProgressBar from './ProgressBar';

type MixItem = { label: string; percent: number };
interface ResultCardProps {
    imgUrl: string;
    mix: MixItem[];
}

const ACCENTS = ['#FF8BA7', '#FFD166', '#7BDFF2'] as const;

export default function ResultCard({ imgUrl, mix }: ResultCardProps) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [downloading, setDownloading] = useState(false);

    const GoHome = () => {
        router.push('/');
    };

    const handleDownload = async () => {
        if (!cardRef.current || downloading) return;
        setDownloading(true);

        // 로드 대기
        await Promise.all(
            Array.from(cardRef.current.querySelectorAll('img')).map(img =>
                img.complete
                    ? Promise.resolve()
                    : new Promise<void>(res => {
                          img.onload = img.onerror = () => res();
                      })
            )
        );
        if ('fonts' in document) {
            try {
                await (document as any).fonts.ready;
            } catch {}
        }

        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: Math.max(2, window.devicePixelRatio || 1),
                cacheBust: true,
            });
            const a = document.createElement('a');
            a.download = 'dogmix_result.png';
            a.href = dataUrl;
            if (typeof a.download === 'undefined') window.open(dataUrl, '_blank');
            else a.click();
        } finally {
            setDownloading(false);
        }
    };

    // 도넛 계산
    const donut = useMemo(() => {
        const total = mix.slice(0, 3).reduce((s, m) => s + m.percent, 0) || 1;
        const r = 56,
            C = 2 * Math.PI * r;
        let acc = 0;
        return mix.slice(0, 3).map((m, i) => {
            const len = C * (m.percent / total);
            const seg = { dasharray: `${len} ${C - len}`, offset: -acc, color: ACCENTS[i % 3] };
            acc += len;
            return { ...seg, label: m.label, percent: Math.round(m.percent) };
        });
    }, [mix]);

    return (
        <div className="bg-white rounded-2xl border-soft shadow-soft w-full max-w-md p-4">
            {/* 캡처 영역 */}
            <div ref={cardRef} className="p-4">
                {/* 이미지 */}
                <div className="overflow-hidden rounded-2xl">
                    <img src={imgUrl} alt="업로드한 반려견" className="w-full max-h-[340px] object-contain bg-white" />
                </div>

                {/* 타이틀 */}
                <div className="mt-4 mb-3 flex items-center justify-between">
                    <h2 className="text-[18px] font-extrabold text-gray-900">AI Scanning Result</h2>
                    <span className="rounded-full px-3 py-1 text-[12px] font-semibold text-indigo-600 bg-indigo-50 whitespace-nowrap">
                        Mixed Breed
                    </span>
                </div>

                {/* 도넛 + Top1 */}
                <div className="mb-4 flex items-center gap-4">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        <g transform="translate(70,70)">
                            <circle r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                            {donut.map((d, idx) => (
                                <circle
                                    key={idx}
                                    r="56"
                                    fill="none"
                                    stroke={d.color}
                                    strokeWidth="12"
                                    strokeDasharray={d.dasharray}
                                    strokeDashoffset={d.offset}
                                    transform="rotate(-90)"
                                    strokeLinecap="round"
                                />
                            ))}
                        </g>
                    </svg>

                    {mix[0] && (
                        <div>
                            <div className="text-[14px] font-semibold text-gray-500">Top Match</div>
                            <div className="mt-1 text-[20px] font-extrabold text-gray-900">{mix[0].label}</div>
                            <div className="text-[16px] font-bold text-[#FF8BA7]">{Math.round(mix[0].percent)}%</div>
                        </div>
                    )}
                </div>

                {/* 리스트 */}
                <div className="space-y-4">
                    {mix.map((m, i) => (
                        <ProgressBar
                            key={m.label}
                            label={m.label}
                            percent={m.percent}
                            color={`accent-${(i % 3) + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* 버튼 */}
            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    onClick={GoHome}
                    className="rounded-full px-5 py-3 text-[15px] font-semibold bg-gray-200 text-gray-700 hover:brightness-95 cursor-pointer">
                    Home
                </button>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="rounded-full px-5 py-3 text-[15px] font-semibold text-white btn-grad-blue disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ">
                    결과 다운로드
                </button>
            </div>
        </div>
    );
}
