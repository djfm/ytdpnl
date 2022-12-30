export type Logger = (message: string, ...args: any[]) => void;

export const createDefaultLogger = (): Logger =>
	(...args: any[]) => {
		console.log(new Date(), ...args);
	};

export default createDefaultLogger;
