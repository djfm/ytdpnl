import {type Admin} from '../server/models/admin';
import {type Token} from '../server/models/token';
import {type LoginResponse} from '../server/api/login';

import {postRegister, postLogin} from '../server/routes';
import {getMessage, type Maybe, isMaybe} from '../util';

export type AdminApi = {
	isLoggedIn: () => boolean;
	setAuth: (token: Token, admin: Admin) => void;
	login: (username: string, password: string) => Promise<Maybe<LoginResponse>>;
	register: (admin: Admin) => Promise<Maybe<string>>;
	getAdmin: () => Admin | undefined;
};

export const createAdminApi = (serverUrl: string): AdminApi => {
	console.log('adminApi', serverUrl);

	let token: Token | undefined;
	let admin: Admin | undefined;

	return {
		getAdmin() {
			return admin;
		},

		isLoggedIn() {
			return Boolean(token) && Boolean(admin);
		},

		setAuth(t: Token, a: Admin) {
			token = t;
			admin = a;
		},

		async login(email: string, password: string) {
			console.log('login', email, password);

			const result = await fetch(`${serverUrl}${postLogin}`, {
				method: 'POST',
				body: JSON.stringify({email, password}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const json = await result.json() as unknown;

			if (isMaybe<LoginResponse>(json)) {
				return json;
			}

			return {
				kind: 'Failure',
				message: 'Invalid response from server',
			};
		},

		async register(admin: Admin) {
			try {
				const result = await fetch(`${serverUrl}${postRegister}`, {
					method: 'POST',
					body: JSON.stringify(admin),
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const json = await result.json() as unknown;

				if (!isMaybe<string>(json)) {
					throw new Error('Invalid response from server');
				}

				return json;
			} catch (error) {
				console.error(error);
				return {
					kind: 'Failure',
					message: getMessage(error, 'Unknown error'),
				};
			}
		},
	};
};

export default AdminApi;
