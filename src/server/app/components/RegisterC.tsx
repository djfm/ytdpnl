import React from 'react';

import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Input,
} from '@mui/material';

import {Link} from 'react-router-dom';

import Admin from '../../models/admin';

export const RegisterC: React.FC<{
	setAdmin: (admin: Admin) => void;
}> = ({setAdmin}) => {
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
				<h1>Admin registration</h1>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='name'>Name</InputLabel>
					<Input id='name' type='text' />
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='email'>Email</InputLabel>
					<Input id='email' type='email' />
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='password'>Password</InputLabel>
					<Input id='password' type='password' />
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='confirm'>Password confirmation</InputLabel>
					<Input id='confirm' type='password' />
				</FormControl>

				<Button variant='contained' sx={{mt: 2}} onClick={tryToLogin}>
					Register
				</Button>

				<Box sx={{mt: 2}}>
					<Link to='/'>Login instead</Link>
				</Box>
			</form>
		</Box>
	);

	return ui;
};

export default RegisterC;
