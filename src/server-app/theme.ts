import {createTheme} from '@mui/material';

export const theme = createTheme({});

theme.typography.h1 = {
	fontSize: '1.5rem',
	[theme.breakpoints.up('sm')]: {
		fontSize: '2.5rem',
	},
};

export default theme;
