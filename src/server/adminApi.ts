import type Admin from './models/admin';

export type AdminApi = {
	login: (username: string, password: string) => Promise<Admin | undefined>;
};

export const createAdminApi = (serverUrl: string): AdminApi => {
	console.log('adminApi', serverUrl);

	return {
		async login(username: string, password: string) {
			console.log('login', username, password);
			return undefined;
		},
	};
};

export default AdminApi;
