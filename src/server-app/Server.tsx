import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import Protect from './components/RequireAuthC';
import LoginC from './components/LoginC';
import RegisterC from './components/RegisterC';
import HomeC from './components/HomeC';
import NotFoundC from './components/NotFoundC';

export const Server = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	return (
		<Routes>
			<Route path='/' element={<Protect><HomeC /></Protect>} />
			<Route path='/login' element={<LoginC {...{email, setEmail, password, setPassword}} />} />
			<Route path='/register' element={<RegisterC {...{email, setEmail, password, setPassword}} />} />
			<Route path='*' element={<NotFoundC />} />
		</Routes>
	);
};

export default Server;
