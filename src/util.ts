import {validate as validateInstance, type ValidationError} from 'class-validator';

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

export const get = (path: string[]) => (x: unknown): unknown => {
	let out = x;

	for (const key of path) {
		if (!has(key)(out)) {
			throw new Error(`Missing property ${key} in ${JSON.stringify(out)}`);
		}

		out = out[key];
	}

	return out;
};

export const getString = (path: string[]) => (x: unknown): string => {
	const out = get(path)(x);

	if (typeof out !== 'string') {
		throw new Error(`Expected string at ${path.join('.')}, got ${JSON.stringify(out)}`);
	}

	return out;
};

export const getNumber = (path: string[]) => (x: unknown): number => {
	const out = get(path)(x);

	if (typeof out !== 'number') {
		throw new Error(`Expected number at ${path.join('.')}, got ${JSON.stringify(out)}`);
	}

	return out;
};

export const getInteger = (path: string[]) => (x: unknown): number => {
	const out = getNumber(path)(x);

	if (!Number.isInteger(out)) {
		throw new Error(`Expected integer at ${path.join('.')}, got ${JSON.stringify(out)}`);
	}

	return out;
};

const flattenErrors = (errors: ValidationError[]): string[] => {
	const result: string[] = [];

	for (const error of errors) {
		if (error.children && error.children.length > 0) {
			result.push(...flattenErrors(error.children));
		}

		if (error.constraints) {
			result.push(...Object.values(error.constraints));
		}
	}

	return result;
};

// eslint-disable-next-line @typescript-eslint/ban-types
const doValidate = async <T extends Object>(object: T, validateId: boolean): Promise<string[]> => {
	const errors = await validateInstance(object);

	if (validateId) {
		return flattenErrors(errors);
	}

	const filteredErrors = errors.filter(error => error.property !== 'id');

	return flattenErrors(filteredErrors);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const validateNew = async <T extends Object>(object: T): Promise<string[]> =>
	doValidate(object, false);

// eslint-disable-next-line @typescript-eslint/ban-types
export const validateExisting = async <T extends Object>(object: T): Promise<string[]> =>
	doValidate(object, true);
