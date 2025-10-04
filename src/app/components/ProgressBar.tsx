'use client';

type Props = {
    label: string;
    percent: number;
    color?: string;
};

export default function ProgressBar({ label, percent, color = 'accent-1' }: Props) {
    const safe = Math.max(0, Math.min(100, percent));

    return (
        <div className="w-full">
            <div className="mb-2 flex items-end justify-between">
                <span className="text-[15px] font-semibold text-gray-900">{label}</span>
                <span className="text-[15px] font-semibold text-gray-500 tabular-nums">{safe}%</span>
            </div>

            {/* 바 영역 */}
            <div
                className="bar-bg h-3.5 w-full rounded-full overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safe}
                aria-label={label}>
                <div
                    className={`h-full ${color} transition-[width] duration-200 ease-out`}
                    style={{ width: `${safe}%` }}
                />
            </div>
        </div>
    );
}
