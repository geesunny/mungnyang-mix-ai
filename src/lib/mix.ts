import type { RawPred } from './labels';
import { normalizeLabel, coarseClass, displayLabel } from './labels';

/**
 * 예측값 배열에서 품종만 추려 대표키로 합산 → 상위 3개 100% 정규화
 */
export function toMixTop3(preds: RawPred[], topK = 3) {
    // 1. 종 별로 합산할 버킷 준비
    const bucket = new Map<string, number>();

    for (const p of preds) {
        // 멍냥 분류
        const cls = coarseClass(p.className);
        if (cls === 'other') continue;

        let key = normalizeLabel(p.className);

        if (cls === 'dog' && !key.includes('dog') && !key.includes('_')) key = 'dog_generic';
        if (cls === 'cat' && !key.includes('cat') && !key.includes('_')) key = 'cat_generic';

        bucket.set(key, (bucket.get(key) ?? 0) + p.probability);
    }

    // 멍냥 관련 라벨이 없으면 빈 배열
    if (bucket.size === 0) return [];

    // 2. Map → 배열 변환 후 내림차순
    const arr = [...bucket.entries()]
        .map(([key, value]) => ({
            key,

            label: key === 'dog_generic' ? 'Dog' : key === 'cat_generic' ? 'Cat' : displayLabel(key),
            value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topK);

    // 3. 100%로 정규화
    const sum = arr.reduce((s, x) => s + x.value, 0);
    const out = arr.map(x => ({ label: x.label, percent: Math.round((x.value / sum) * 100) }));

    // 4. 반올림 오차 보정
    const diff = 100 - out.reduce((s, x) => s + x.percent, 0);
    if (out.length && diff) out[out.length - 1].percent += diff;

    return out;
}
