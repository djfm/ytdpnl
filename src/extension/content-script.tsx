import React from 'react';
import {createRoot} from 'react-dom/client';

import {ThemeProvider} from '@mui/material';

import {isOnVideoPage} from './lib';
import App from './App';
import theme from './theme';

import {defaultApi as api, apiProvider as ApiProvider} from './apiProvider';

let root: HTMLElement | undefined;

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

	if (!root) {
		root = document.createElement('div');

		createRoot(root).render((
			<React.StrictMode>
				<ThemeProvider theme={theme}>
					<ApiProvider value={api}>
						<App />
					</ApiProvider>
				</ThemeProvider>
			</React.StrictMode>
		));
	}

	relatedElt.parentElement.appendChild(root);
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

