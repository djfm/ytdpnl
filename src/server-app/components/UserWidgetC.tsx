import React from 'react';

import {useAdminApi} from '../adminApiProvider';

export const UserWidgetC: React.FC = () => {
	const api = useAdminApi();
	const admin = api.getAdmin();

	if (admin) {
		return <div>Hello {admin.email}</div>;
	}

	return <div>Hello guest</div>;
};

export default UserWidgetC;
