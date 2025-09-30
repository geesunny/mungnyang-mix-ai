'use client';

type MixItem = {
    label: string;
    percent: number;
};

interface ResultCardProps {
    imgUrl: string;
    mix: MixItem[];
}

export default function ResultCard({ imgUrl, mix }: ResultCardProps) {
    return (
        <div className="w-full max-w-md rounded-xl border p-4 shadow bg-white">
            {/* 업로드사진 */}
            <img src={imgUrl} alt="업로드한 반려견" className="w-full rounded-lg object-cover" />

            {/* 결과 */}
            <div className="mt-4 space-y-2">
                <h2 className="text-lg font-bold"> 믹스 비율 </h2>
                {mix.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{item.label}</span>
                        <span>{item.percent}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
