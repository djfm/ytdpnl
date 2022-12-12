export const has = (key: string) => (x: unknown): x is Record<string, unknown> =>
	typeof x === 'object' && x !== null && key in x;
