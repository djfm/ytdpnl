import type Admin from '../server/models/admin';

type Success<T> = {
	kind: 'Success';
	value: T;
};

type Failure = {
	kind: 'Failure';
	message: string;
};

type Maybe<T> = Success<T> | Failure;

export type AdminApi = {
	login: (username: string, password: string) => Promise<Admin | undefined>;
	register: (admin: Admin) => Promise<Maybe<Admin>>;
};

export const createAdminApi = (serverUrl: string): AdminApi => {
	console.log('adminApi', serverUrl);

	return {
		async login(username: string, password: string) {
			console.log('login', username, password);
			return undefined;
		},

		async register() {
			const result: Maybe<Admin> = {
				kind: 'Failure',
				message: 'Not implemented',
			};

			return result;
		},
	};
};

export default AdminApi;
