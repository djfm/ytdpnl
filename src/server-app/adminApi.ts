import {Admin} from '../server/models/admin';

import {postRegister} from '../server/routes';
import {getMessage, validateExisting} from '../util';

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

		async register(admin: Admin) {
			try {
				const result = await fetch(`${serverUrl}${postRegister}`, {
					method: 'POST',
					body: JSON.stringify(admin),
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!result.ok) {
					return {
						kind: 'Failure',
						message: 'API error',
					};
				}

				const json = await result.json() as unknown;
				const res = new Admin();

				Object.assign(res, json);
				const errors = await validateExisting(res);

				if (errors.length > 0) {
					const err: Maybe<Admin> = {
						kind: 'Failure',
						message: 'Invalid entity received from server',
					};

					return err;
				}

				return {
					kind: 'Success',
					value: res,
				};
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
