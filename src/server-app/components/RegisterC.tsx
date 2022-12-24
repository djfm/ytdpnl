import React, {useState} from 'react';

import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Input,
	Typography,
} from '@mui/material';

import {Link} from 'react-router-dom';

import {validate, type ValidationError} from 'class-validator';

import Admin from '../../server/models/admin';

import {bind} from './helpers';

const flattenErrors = (errors: ValidationError[]): string[] => {
	const result: string[] = [];

	for (const error of errors) {
		if (error.children && error.children.length > 0) {
			result.push(...flattenErrors(error.children));
		}

		if (error.constraints) {
			result.push(...Object.values(error.constraints));
		}
	}

	return result;
};

const ErrorsWidget: React.FC<{errors: string[]}> = ({errors}) => {
	if (errors.length === 0) {
		return null;
	}

	return (
		<Box sx={{mt: 2, color: 'red'}}>
			<Typography>Oops!</Typography>
			<ul>
				{errors.map((error, i) => (
					<li key={i}>
						<Typography>{error}</Typography>
					</li>
				))}
			</ul>
		</Box>
	);
};

export const RegisterC: React.FC<{
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
	const [confirm, setConfirm] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [errors, setErrors] = useState<string[]>([]);

	const tryToRegister = () => {
		(async () => {
			const admin = new Admin();
			Object.assign(admin, {
				name,
				email,
				password,
			});

			const validationErrors = flattenErrors(await validate(admin));

			if (password !== confirm) {
				validationErrors.push('Passwords should match');
			}

			if (validationErrors.length > 0) {
				setErrors(validationErrors);
				return;
			}

			setErrors([]);

			setAdmin(admin);
		})();
	};

	const ui = (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'top',
			mt: 6,
		}}>
			<form onSubmit={e => {
				console.log('submit');
				tryToRegister();
				e.preventDefault();
			}}>
				<h1>Admin registration</h1>

				<ErrorsWidget errors={errors}/>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='name'>Name</InputLabel>
					<Input id='name' type='text' {...bind(name, setName)}/>
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='email'>Email</InputLabel>
					<Input id='email' type='email' {...bind(email, setEmail)}/>
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='password'>Password</InputLabel>
					<Input id='password' type='password' {...bind(password, setPassword)}/>
				</FormControl>

				<FormControl sx={{mb: 2, display: 'block'}}>
					<InputLabel htmlFor='confirm'>Password confirmation</InputLabel>
					<Input id='confirm' type='password' {...bind(confirm, setConfirm)}/>
				</FormControl>

				<Button type='submit' variant='contained' sx={{mt: 2}}>
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
