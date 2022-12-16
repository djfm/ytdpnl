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
