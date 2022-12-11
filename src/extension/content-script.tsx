import React from 'react';
import {createRoot} from 'react-dom/client';

import {isOnVideoPage} from './lib';
import App from './App';

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

	createRoot(root).render(<App />);
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

