import {type Admin} from '../server/models/admin';
import {type Token} from '../server/models/token';
import {type LoginResponse} from '../server/api/login';

import {postRegister, postLogin, getAuthTest} from '../server/routes';
import {type Maybe, isMaybe} from '../util';

export type AdminApi = {
	isLoggedIn: () => boolean;
	setAuth: (token: Token, admin: Admin) => void;
	login: (username: string, password: string) => Promise<Maybe<LoginResponse>>;
	register: (admin: Admin) => Promise<Maybe<string>>;
	getAdmin: () => Admin | undefined;
	getAuthTest: () => Promise<Maybe<Admin>>;
};

const loadItem = <T>(key: string): T | undefined => {
	const item = sessionStorage.getItem(key);

	if (!item) {
		return undefined;
	}

	return JSON.parse(item) as T;
};

export const createAdminApi = (serverUrl: string): AdminApi => {
	console.log('adminApi', serverUrl);

	let token = loadItem<Token>('token');
	let admin = loadItem<Admin>('admin');

	const verb = (method: 'GET' | 'POST') => async <T>(path: string, data: unknown) => {
		const body = method === 'POST' ? JSON.stringify(data) : undefined;

		const result = await fetch(`${serverUrl}${path}`, {
			method,
			body,
			headers: {
				'Content-Type': 'application/json',
				// eslint-disable-next-line @typescript-eslint/naming-convention
				Authorization: `${token?.token ?? ''}`,
			},
		});

		const json = await result.json() as unknown;

		if (isMaybe<T>(json)) {
			return json;
		}

		const res: Maybe<T> = {
			kind: 'Failure',
			message: 'Invalid response from server',
		};

		return res;
	};

	const get = verb('GET');
	const post = verb('POST');

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
			sessionStorage.setItem('token', JSON.stringify(t));
			sessionStorage.setItem('admin', JSON.stringify(a));
		},

		async login(email: string, password: string) {
			return post<LoginResponse>(postLogin, {email, password});
		},

		async register(admin: Admin) {
			return post<string>(postRegister, admin);
		},

		async getAuthTest() {
			return get<Admin>(getAuthTest, {});
		},
	};
};

export default AdminApi;
