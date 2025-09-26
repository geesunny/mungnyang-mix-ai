export async function resizeImage(
    file: File,
    maxSize = 1024,
    mime: string = 'image/jpeg',
    quality = 0.9
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();

        // 파일 읽기 성공
        reader.onload = e => {
            const src = e.target?.result as string | undefined;
            if (!src) return reject(new Error('멍냥 이미지를 읽을 수 없습니다'));
            img.src = src;
        };

        // 파일 읽기 실패
        reader.onerror = () => {
            reject(new Error('멍냥 이미지 읽기 실패'));
        };

        // 이미지 로드 실패
        img.onerror = () => {
            reject(new Error('멍냥 이미지 로드 실패'));
        };

        // 이미지 로드 성공
        img.onload = () => {
            let { width, height } = img;

            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round((width * maxSize) / height);
                    height = maxSize;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('캔버스 컨텍스트 생성 실패'));

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('이미지 리사이즈 실패'))), mime, quality);
        };

        // 파일 읽기 시작
        reader.readAsDataURL(file);
    });
}
