import React from 'react';
import {createRoot} from 'react-dom/client';

import {ThemeProvider} from '@mui/material';

import theme from './theme';
import Server from './Server';

const elt = document.getElementById('app');

if (!elt) {
	throw new Error('No element with id "app" found');
}

createRoot(elt).render(<ThemeProvider theme={theme}><Server /></ThemeProvider>);
