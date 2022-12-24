import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import type Admin from '../models/admin';

import Protect from './components/RequireAuthC';
import LoginC from './components/LoginC';
import RegisterC from './components/RegisterC';
import HomeC from './components/HomeC';

export const Server = () => {
	const [, setAdmin] = useState<Admin | undefined>();

	return (
		<Routes>
			<Route path='/' element={<Protect><HomeC /></Protect>} />
			<Route path='/login' element={<LoginC setAdmin={setAdmin} />} />
			<Route path='/register' element={<RegisterC setAdmin={setAdmin} />} />
		</Routes>
	);
};

export default Server;
