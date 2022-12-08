import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';

const appRootId = 'ytdpnl-app-root';
let lastVideoUrl = '';

const onVideoChanged = (videoUrl: string) => {
	console.log('video changed:', videoUrl);
};

const onVideoMightHaveChanged = (videoUrl: string) => {
	if (videoUrl === lastVideoUrl) {
		return;
	}

	lastVideoUrl = videoUrl;

	onVideoChanged(videoUrl);
};

const isOnVideoPage = () => window.location.pathname === '/watch';

if (isOnVideoPage()) {
	onVideoMightHaveChanged(window.location.href);
}

const hideNativeRecommendationsAndEnsureExtensionIsInjected = () => {
	const relatedElt = document.querySelector('#related');

	if (!relatedElt) {
		return;
	}

	const relatedHtmlElt = relatedElt as HTMLElement;

	if (relatedHtmlElt.style.display !== 'none') {
		relatedHtmlElt.style.display = 'none';

		const appRoot = document.createElement('div');
		appRoot.id = appRootId;

		const parent = relatedElt.parentElement;

		if (!parent) {
			console.error('Could not find parent element of #related');
			return;
		}

		parent.insertBefore(appRoot, relatedElt);

		const root = createRoot(appRoot);
		root.render(<App />);
	}
};

const observer = new MutationObserver(() => {
	const videoUrl = window.location.href;

	if (isOnVideoPage()) {
		onVideoMightHaveChanged(videoUrl);
	}

	hideNativeRecommendationsAndEnsureExtensionIsInjected();
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});
