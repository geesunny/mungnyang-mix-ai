'use client';

import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

type MixItem = {
    label: string;
    percent: number;
};

interface ResultCardProps {
    imgUrl: string;
    mix: MixItem[];
}

export default function ResultCard({ imgUrl, mix }: ResultCardProps) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement | null>(null);

    const goHome = () => router.push('/');

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, { scale: 2 });
            const link = document.createElement('a');
            link.download = 'dogmix_result.png';
            link.href = canvas.toDataURL('image/png');

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md">
            <div ref={cardRef} className="w-full max-w-md rounded-xl border p-4 shadow bg-white">
                {/* 업로드사진 */}
                <img src={imgUrl} alt="업로드한 반려견" className="w-full rounded-lg object-cover aspect-[4/3]" />

                {/* 결과 */}
                <div className="mt-4 space-y-2">
                    <h2 className="text-lg font-bold"> 믹스 비율 </h2>
                    {mix.map(item => (
                        <div key={item.label} className="flex justify-between">
                            <span>{item.label}</span>
                            <span>{item.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex gap-2 items-center justify-center">
                <button
                    onClick={handleDownload}
                    className="rounded bg-violet-600 px-4 py-2 text-white whitespace-nowrap">
                    download
                </button>
                <button onClick={goHome} className="rounded bg-violet-600 px-4 py-2 text-white">
                    Home
                </button>
            </div>
        </div>
    );
}
