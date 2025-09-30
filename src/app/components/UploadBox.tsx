'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resizeImage } from '@/lib/resize';
import { classifyImage } from '@/lib/mobilenet';
import { toMixTop3 } from '@/lib/mix';

export default function UploadBox() {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(
        () => () => {
            if (preview) URL.revokeObjectURL(preview);
        },
        [preview]
    );

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있어요!');
            return;
        }
        try {
            const blob = await resizeImage(file, 1024, 'image/jpeg', 0.9);
            const url = URL.createObjectURL(blob);
            setPreview(old => {
                if (old) URL.revokeObjectURL(old);
                return url;
            });
        } catch (err) {
            alert('이미지 리사이즈 실패');
        }
    };

    const handleClick = () => inputRef.current?.click();

    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleImageLoad = async () => {
        if (!imgRef.current || !preview) return;
        try {
            const preds = await classifyImage(imgRef.current, 10);
            const mix = toMixTop3(preds, 3);

            const q = new URLSearchParams({
                img: preview,
                mix: JSON.stringify(mix),
            });
            router.push(`/result?${q.toString()}`);
            console.log('[Mix 결과]', mix);
        } catch (e) {
            console.error('추론 실패:', e);
            alert('why fail why,,,');
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 shadow">
            <button
                type="button"
                onClick={handleClick}
                className="w-full rounded-lg bg-gray-100 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200">
                사진 선택하기
            </button>

            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

            {preview ? (
                <img
                    ref={imgRef}
                    src={preview}
                    alt="업로드한 사진 미리보기"
                    onLoad={handleImageLoad}
                    className="max-h-[360px] w-auto rounded-lg shadow"
                />
            ) : (
                <p className="text-gray-500">강아지 사진을 업로드하세요 </p>
            )}
        </div>
    );
}
