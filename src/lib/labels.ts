export type RawPred = { className: string; probability: number };

/* 1) 원본 → 대표키 매핑  */
const NORMALIZE_MAP: Record<string, string> = {
    // cats
    'egyptian cat': 'egyptian_cat',
    'tabby, tabby cat': 'domestic_cat',
    'tiger cat': 'domestic_cat',
    'persian cat': 'persian_cat',
    'siamese cat': 'siamese_cat',
    // dogs
    'maltese dog': 'maltese',
    'shih-tzu': 'shih_tzu',
    pug: 'pug',
    chihuahua: 'chihuahua',
    pomeranian: 'pomeranian',
    'yorkshire terrier': 'yorkshire_terrier',
    'golden retriever': 'golden_retriever',
    'labrador retriever': 'labrador',
    'german shepherd': 'german_shepherd',
    'siberian husky': 'siberian_husky',
    bulldog: 'bulldog',
    beagle: 'beagle',
    poodle: 'poodle',
    dachshund: 'dachshund',
};

export function normalizeLabel(label: string) {
    const key = label.toLowerCase();
    return NORMALIZE_MAP[key] ?? key;
}

/* 2)카테고리 세트 */
const DOG_SET = new Set<string>([
    'maltese',
    'shih_tzu',
    'pug',
    'chihuahua',
    'pomeranian',
    'yorkshire_terrier',
    'golden_retriever',
    'labrador',
    'german_shepherd',
    'siberian_husky',
    'bulldog',
    'beagle',
    'poodle',
    'dachshund',
]);
const CAT_SET = new Set<string>(['domestic_cat', 'egyptian_cat', 'persian_cat', 'siamese_cat']);

/* 3)개/고양이/기타 분류 */
export function coarseClass(label: string): 'dog' | 'cat' | 'other' {
    const key = normalizeLabel(label);
    if (DOG_SET.has(key)) return 'dog';
    if (CAT_SET.has(key)) return 'cat';
    // fallback: 원본에 dog/cat 포함되면 일반 버킷으로 분류
    const l = label.toLowerCase();
    if (l.includes('dog')) return 'dog';
    if (l.includes('cat')) return 'cat';
    return 'other';
}

/** 화면용 라벨 */
export function displayLabel(normKey: string) {
    return normKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
