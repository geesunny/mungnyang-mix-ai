'use client';

import { useEffect, useState } from 'react';
import ResultCard from '../components/ResultCard';

type MixItem = {
    label: string;
    percent: number;
};

export default function ResultPage() {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [mixData, setMixData] = useState<MixItem[]>([]);

    useEffect(() => {
        const i = sessionStorage.getItem('dogmix:image');
        const m = sessionStorage.getItem('dogmix:mix');

        if (i) setImgUrl(i);
        if (m) setMixData(JSON.parse(m));
    }, []);

    if (!imgUrl || mixData.length === 0) {
        return <p className="p-6"> home에서 다시 시도하기🐾</p>;
    }

    return (
        <main className="flex flex-col items-center p-6">
            <ResultCard imgUrl={imgUrl} mix={mixData} />
        </main>
    );
}
