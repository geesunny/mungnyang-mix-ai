'use client';

import { useEffect, useState } from 'react';
import ResultCard from '../components/ResultCard';
import { useRouter } from 'next/navigation';

type MixItem = {
    label: string;
    percent: number;
};

export default function ResultPage() {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [mixData, setMixData] = useState<MixItem[]>([]);
    const router = useRouter();

    const GoHome = () => {
        router.push('/');
    };

    useEffect(() => {
        const i = sessionStorage.getItem('dogmix:image');
        const m = sessionStorage.getItem('dogmix:mix');

        if (i) setImgUrl(i);
        if (m) setMixData(JSON.parse(m));
    }, []);

    if (!imgUrl || mixData.length === 0) {
        return (
            <div className="flex flex-col items-center p-6 min-h-screen justify-center">
                <div className="bg-white shadow text-center max-w-md gap-2 p-6 border-2 border-dashed border-gray-300 rounded-2xl h-64 w-64 flex flex-col items-center justify-center">
                    <p className="text-[18px] font-bold text-gray-900">AI 이미지 분석 실패</p>
                    <p className="mt-1 text-[14px] text-gray-500">
                        정면이 잘 보이는 사진일수록 <br></br>정확도가 올라가요!
                    </p>
                    <button
                        className="mt-3 rounded-full px-5 py-3 text-[15px] font-semibold text-white btn-grad-blue hover:brightness-105 cursor-pointer"
                        onClick={GoHome}>
                        처음으로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-col items-center p-6 min-h-screen justify-center">
            <ResultCard imgUrl={imgUrl} mix={mixData} />
        </main>
    );
}
