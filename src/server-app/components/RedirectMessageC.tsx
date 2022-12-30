import React, {useEffect, useState} from 'react';

import MessageC from './MessageC';

export const RedirectMessageC: React.FC = () => {
	const [message, setMessage] = useState<string | undefined>();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const message = params.get('message');
		if (message) {
			setMessage(message);
		}
	}, []);

	return <MessageC message={message} type='success' />;
};

export default RedirectMessageC;
