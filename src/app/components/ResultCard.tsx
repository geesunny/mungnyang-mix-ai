'use client';

import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import ProgressBar from './ProgressBar';
import DonutChart from './DonutChart';

type MixItem = { label: string; percent: number };
interface ResultCardProps {
    imgUrl: string;
    mix: MixItem[];
}

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
                    <DonutChart data={mix} />
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
