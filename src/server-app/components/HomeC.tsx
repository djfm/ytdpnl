import React from 'react';

import {Typography} from '@mui/material';

import UserWidgetC from './UserWidgetC';

export const HomeC: React.FC = () => {
	const ui = (
		<div>
			<Typography variant='h1'>Home</Typography>
			<UserWidgetC />
		</div>
	);

	return ui;
};

export default HomeC;
