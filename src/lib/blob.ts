export function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error('파일 읽기 실패'));
        reader.readAsDataURL(blob);
    });
}
