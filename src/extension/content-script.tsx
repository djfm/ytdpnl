import React from 'react';
import {createRoot} from 'react-dom/client';

import {ThemeProvider} from '@mui/material';

import {isOnVideoPage} from './lib';
import App from './App';
import theme from './theme';

const observer = new MutationObserver(() => {
	if (!isOnVideoPage()) {
		return;
	}

	const related = document.querySelector('#related');

	if (!related) {
		return;
	}

	const relatedElt: HTMLElement = related as HTMLElement;

	if (relatedElt.style.display === 'none') {
		return;
	}

	if (!relatedElt.parentElement) {
		return;
	}

	relatedElt.style.display = 'none';

	const root = document.createElement('div');
	relatedElt.parentElement.appendChild(root);

	createRoot(root).render((
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</React.StrictMode>
	));
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

