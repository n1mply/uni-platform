export async function blobUrlToBase64(blobUrl: string): Promise<string> {
    const blob = await fetch(blobUrl).then(res => res.blob());

    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Ошибка при конвертации в base64'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
