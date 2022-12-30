import React from 'react';

import {Link} from 'react-router-dom';

import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Input,
} from '@mui/material';

import Admin from '../../server/models/admin';

import RedirectMessageC from './RedirectMessageC';

import {bind} from './helpers';

export const LoginC: React.FC<{
	setAdmin: (admin: Admin) => void;
	email: string;
	password: string;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
}> = ({
	setAdmin,
	email,
	setEmail,
	password,
	setPassword,
}) => {
	const tryToLogin = () => {
		const admin = new Admin();
		admin.email = 'test@example.com';
		setAdmin(admin);
	};

	const ui = (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'top',
			mt: 6,
		}}>
			<form>
				<h1>Admin login</h1>

				<RedirectMessageC />

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='email'>Email</InputLabel>
					<Input id='email' type='email' {...bind(email, setEmail)}/>
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='password'>Password</InputLabel>
					<Input id='password' type='password' {...bind(password, setPassword)}/>
				</FormControl>

				<Button variant='contained' sx={{mt: 2}} onClick={tryToLogin}>
					Login
				</Button>

				<Box sx={{mt: 2}}>
					<Link to='/register'>Register instead</Link>
				</Box>
			</form>
		</Box>
	);

	return ui;
};

export default LoginC;
