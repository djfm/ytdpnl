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
		<Box sx={{
			mt: 2,
			mb: 2,
			p: 2,
			borderColor: color,
		}} border={1}>
			<Typography color={color}>{message}</Typography>
		</Box>
	);
};

export default MessageC;
