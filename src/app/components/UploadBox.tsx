'use client';

import { useState, useRef } from 'react';

export default function UploadBox() {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있어요!');
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    const handleClick = () => inputRef.current?.click();

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 shadow">
            <button
                type="button"
                onClick={handleClick}
                className="w-full rounded-lg bg-gray-100 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200">
                사진 선택하기
            </button>

            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

            {preview ? (
                <img src={preview} alt="업로드한 사진 미리보기" className="max-h-[360px] w-auto rounded-lg shadow" />
            ) : (
                <p className="text-gray-500">반려동물 사진을 업로드하세요 </p>
            )}
        </div>
    );
}
