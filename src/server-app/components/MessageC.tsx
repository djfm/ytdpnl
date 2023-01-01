import React from 'react';

import {Box, Typography} from '@mui/material';

export const MessageC: React.FC<{
	message?: string;
	type: 'error' | 'success' | 'info';
}> = ({message, type}) => {
	if (!message) {
		return null;
	}

	const color = type === 'error' ? 'error.main' : type === 'success' ? 'success.main' : 'primary.main';

	return (
		<Box>
			<Box sx={{
				mt: 2,
				mb: 2,
				p: 2,
				borderColor: color,
				display: 'inline-block',
			}} border={1}>
				<Typography color={color}>{message}</Typography>
			</Box>
		</Box>
	);
};

export const StatusMessageC: React.FC<{
	info?: string;
	success?: string;
	error?: string;
}> = ({info, success, error}) => {
	if (error) {
		return <MessageC message={error} type='error' />;
	}

	if (success) {
		return <MessageC message={success} type='success' />;
	}

	if (info) {
		return <MessageC message={info} type='info' />;
	}

	return null;
};

export default MessageC;
