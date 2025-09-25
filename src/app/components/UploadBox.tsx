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
        <div>
            <button type="button" onClick={handleClick}>
                사진 선택하기
            </button>

            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} />

            {preview ? <img src={preview} alt="업로드한 사진 미리보기" /> : <p>반려동물 사진을 업로드하세요</p>}
        </div>
    );
}
