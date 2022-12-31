import React, {useState, useEffect} from 'react';

import {useAdminApi} from '../adminApiProvider';

import type Admin from '../../server/models/admin';

import MessageC from './MessageC';

export const UserWidgetC: React.FC = () => {
	const api = useAdminApi();

	const [admin, setAdmin] = useState<Admin>();
	const [error, setError] = useState<string | undefined>();

	useEffect(() => {
		(async () => {
			const res = await api.getAuthTest();

			if (res.kind === 'Success') {
				setAdmin(res.value);
			} else {
				setError(res.message);
			}
		})();
	}, []);

	return <div>
		Hello {admin?.email ?? 'guest'}!
		<MessageC message={error} type='error' />
	</div>;
};

export default UserWidgetC;
