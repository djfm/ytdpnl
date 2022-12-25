import {Admin} from '../server/models/admin';

import {postRegister} from '../server/routes';
import {getMessage, restoreInnerType, type Maybe, isMaybe} from '../util';

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

				const json = await result.json() as unknown;

				if (!isMaybe<Admin>(json)) {
					throw new Error('Invalid response from server');
				}

				return restoreInnerType(json, Admin);
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
