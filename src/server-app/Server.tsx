import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import type Admin from '../server/models/admin';

import Protect from './components/RequireAuthC';
import LoginC from './components/LoginC';
import RegisterC from './components/RegisterC';
import HomeC from './components/HomeC';
import VerifyEmailC from './components/VerifyEmail';

export const Server = () => {
	const [, setAdmin] = useState<Admin | undefined>();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	return (
		<Routes>
			<Route path='/' element={<Protect><HomeC /></Protect>} />
			<Route path='/login' element={<LoginC {...{setAdmin, email, setEmail, password, setPassword}} />} />
			<Route path='/register' element={<RegisterC {...{email, setEmail, password, setPassword}} />} />
			<Route path='/verify-email' element={<VerifyEmailC />} />
		</Routes>
	);
};

export default Server;
