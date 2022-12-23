import React, {useState} from 'react';

import type Admin from '../models/admin';
import {AdminProvider} from './AdminContext';

import LoginC from './components/LoginC';
import HomeC from './components/HomeC';

export const Server = () => {
	const [admin, setAdmin] = useState<Admin | undefined>();

	if (!admin) {
		return <LoginC setAdmin={setAdmin} />;
	}

	return (
		<AdminProvider value={admin}>
			<div>Hello server my old friend!</div>
			<HomeC />
		</AdminProvider>
	);
};

export default Server;
