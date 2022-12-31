import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import type {Maybe} from '../../util';

export const randomToken = () => crypto.randomBytes(128).toString('hex');

export const hashPassword = async (password: string): Promise<string> => new Promise((resolve, reject) => {
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(hash);
	});
});

export const checkPassword = async (password: string, hash: string): Promise<boolean> => new Promise((resolve, reject) => {
	bcrypt.compare(password, hash, (err, result) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(result);
	});
});

export type TokenTools = {
	sign: (expiresIn: string, adminId: number) => string;
	verify: (token: string) => Maybe<{adminId: string}>;
};

export const createTokenTools = (secretKey: string): TokenTools => ({
	sign: (expiresIn, adminId) => jwt.sign({adminId}, secretKey, {expiresIn, algorithm: 'RS256'}),
	verify(token) {
		try {
			const {adminId} = jwt.verify(token, secretKey, {algorithms: ['RS256']}) as {adminId: string};
			return {kind: 'Success', value: {adminId}};
		} catch (err) {
			return {
				kind: 'Failure',
				message: 'Invalid token',
			};
		}
	},
});

