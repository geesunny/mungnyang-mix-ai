import type { RawPred } from './labels';
import { isDog, displayLabel } from './labels';

export function toMixTop3(preds: RawPred[], topK = 3) {
    const bucket = new Map<string, number>();

    for (const p of preds) {
        const raw = p.className;
        if (!isDog(raw)) continue;

        const label = displayLabel(raw);
        bucket.set(label, (bucket.get(label) ?? 0) + p.probability);
    }

    if (bucket.size === 0) return [];

    const arr = [...bucket.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topK);

    const sum = arr.reduce((s, x) => s + x.value, 0);
    const out = arr.map(x => ({ label: x.label, percent: Math.round((x.value / sum) * 100) }));

    const diff = 100 - out.reduce((s, x) => s + x.percent, 0);
    if (out.length && diff) out[out.length - 1].percent += diff;

    return out.filter(x => x.percent > 0);
}
