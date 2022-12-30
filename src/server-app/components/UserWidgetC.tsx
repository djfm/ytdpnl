import React, {useState, useEffect} from 'react';

import {useAdminApi} from '../adminApiProvider';

import MessageC from './MessageC';

export const UserWidgetC: React.FC = () => {
	const api = useAdminApi();
	const admin = api.getAdmin();

	const [message, setMessage] = useState<string | undefined>();

	useEffect(() => {
		(async () => {
			const res = await api.getAuthTest();

			if (res.kind === 'Success') {
				setMessage(res.value);
			} else {
				setMessage(res.message);
			}
		})();
	});

	if (admin) {
		return <div>
			Hello {admin.email}
			<MessageC message={message} type='info' />
		</div>;
	}

	return <div>Hello guest</div>;
};

export default UserWidgetC;
