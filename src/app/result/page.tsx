'use client';

import { useSearchParams } from 'next/navigation';
import ResultCard from '../components/ResultCard';

export default function ResultPage() {
    const params = useSearchParams();
    const imgUrl = params.get('img');
    const mixData = params.get('mix');

    if (!imgUrl || !mixData) {
        return <p>결과 데이터가 없습니다. 다시 업로드해주세요 🐾</p>;
    }

    const parsedMix = JSON.parse(mixData);

    return (
        <main className="flex flex-col items-center p-6">
            <ResultCard imgUrl={imgUrl} mix={parsedMix} />
        </main>
    );
}
