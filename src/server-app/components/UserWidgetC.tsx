import React from 'react';

import {useAdmin} from '../adminContext';

export const UserWidgetC: React.FC = () => {
	const admin = useAdmin();

	if (admin) {
		return <div>Hello {admin.email}</div>;
	}

	return <div>Hello guest</div>;
};

export default UserWidgetC;
