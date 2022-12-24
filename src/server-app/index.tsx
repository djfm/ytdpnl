import React from 'react';
import {createRoot} from 'react-dom/client';

import {ThemeProvider} from '@mui/material';

import {BrowserRouter} from 'react-router-dom';

import theme from './theme';
import AdminApiProvider, {defaultAdminApi} from './adminApiProvider';
import Server from './Server';

const elt = document.getElementById('app');

if (!elt) {
	throw new Error('No element with id "app" found');
}

createRoot(elt).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<AdminApiProvider value={defaultAdminApi}>
					<Server />
				</AdminApiProvider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>,
);
