import type Recommendation from './extension/models/Recommendation';

export const setPersonalizedFlags = (nonPersonalized: Recommendation[], personalized: Recommendation[]): [Recommendation[], Recommendation[]] => {
	const nonPersonalizedSet = new Set<string>();
	const personalizedSet = new Set<string>();

	const nonPersonalizedOut: Recommendation[] = [];
	const personalizedOut: Recommendation[] = [];

	for (const rec of nonPersonalized) {
		nonPersonalizedSet.add(rec.videoId);
		nonPersonalizedOut.push({...rec});
	}

	for (const rec of personalized) {
		personalizedSet.add(rec.videoId);
		personalizedOut.push({...rec});
	}

	for (const rec of nonPersonalizedOut) {
		if (personalizedSet.has(rec.videoId)) {
			rec.personalization = 'mixed';
		} else {
			rec.personalization = 'non-personalized';
		}
	}

	for (const rec of personalizedOut) {
		if (nonPersonalizedSet.has(rec.videoId)) {
			rec.personalization = 'mixed';
		} else {
			rec.personalization =	'personalized';
		}
	}

	return [nonPersonalizedOut, personalizedOut];
};

// Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
export const shuffleArray = <T>(array: T[]): T[] => {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
};

export const removeDuplicates = <T, U> (identifier: (x: T) => U) => (array: T[]): T[] => {
	const ids = new Set<U>();
	const result: T[] = [];

	for (const item of array) {
		const id = identifier(item);

		if (!ids.has(id)) {
			result.push(item);
			ids.add(id);
		}
	}

	return result;
};

export const has = (key: string) => (x: unknown): x is Record<string, unknown> =>
	typeof x === 'object' && x !== null && key in x;

export const memoizeTemporarily = (ttlMs: number) => <T, U>(f: (x: T) => U): ((x: T) => U) => {
	const cache = new Map<T, U>();

	return (x: T) => {
		if (cache.has(x)) {
			const out = cache.get(x);

			if (!out) {
				throw new Error('never happens');
			}

			return out;
		}

		const res = f(x);
		cache.set(x, res);

		setTimeout(() => {
			cache.delete(x);
		}, ttlMs);

		return res;
	};
};

export const wait = async (ms: number): Promise<void> => new Promise(resolve => {
	setTimeout(resolve, ms);
});
