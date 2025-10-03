'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resizeImage } from '@/lib/resize';
import { classifyImage } from '@/lib/mobilenet';
import { toMixTop3 } from '@/lib/mix';
import { blobToDataURL } from '@/lib/blob';

export default function UploadBox() {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const handlePickImage = () => inputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있어요!');
            return;
        }
        try {
            const blob = await resizeImage(file, 800, 'image/jpeg', 0.9);
            const base64 = await blobToDataURL(blob);
            setPreview(base64);
        } catch {
            alert('이미지 리사이즈 실패');
        }
    };

    const handleImageLoad = async () => {
        if (!imgRef.current || !preview) return;
        try {
            const preds = await classifyImage(imgRef.current, 10);
            const mix = toMixTop3(preds, 3);
            sessionStorage.setItem('dogmix:image', preview);
            sessionStorage.setItem('dogmix:mix', JSON.stringify(mix));
            router.push('/result');
        } catch (e) {
            router.push('/result');
        }
    };

    return (
        <>
            <div className="bg-white shadow w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-2xl">
                {!preview ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                            <span className="text-2xl">📷</span>
                        </div>

                        <div className="text-center">
                            <p className="text-[18px] font-bold text-gray-900">강아지 사진 업로드</p>
                            <p className="mt-1 text-[14px] text-gray-500">
                                정면이 잘 보이는 사진일수록 정확도가 올라가요!
                            </p>
                        </div>

                        <button
                            onClick={handlePickImage}
                            className="mt-3 rounded-full px-5 py-3 text-[15px] font-semibold text-white btn-grad-pink hover:brightness-105 cursor-pointer">
                            사진 선택하기
                        </button>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <img
                            ref={imgRef}
                            src={preview}
                            alt="업로드한 사진 미리보기"
                            onLoad={handleImageLoad}
                            className="max-h-[360px] w-auto rounded-2xl shadow-md"
                        />
                        <div className="text-[14px] text-gray-500">사진 분석 중 멍멍 품종은 뭘까여⏳</div>
                    </div>
                )}
            </div>
        </>
    );
}
