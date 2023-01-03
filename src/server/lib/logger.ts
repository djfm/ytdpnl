export type LogFunction = (message: string, ...args: any[]) => void;

export type CreateLogger = (requestId: number) => LogFunction;

export const createDefaultLogger = (): CreateLogger => (requestId: number) =>
	(...args: any[]) => {
		console.log(`[request #${requestId} at ${new Date().toISOString()}]`, ...args.map(arg => {
			if (typeof arg === 'string') {
				return arg.toLowerCase();
			}

			return arg as unknown;
		}));
	};

export default createDefaultLogger;
