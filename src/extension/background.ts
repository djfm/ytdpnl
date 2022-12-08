console.log('background.ts');

chrome.runtime.onInstalled.addListener(() => {
	chrome.webRequest.onCompleted.addListener(
		details => {
			console.log(details);
		},
		{
			urls: ['https://*.youtube.com/*'],
		},
		[],
	);
});

self.addEventListener('fetch', event => {
	console.log(event);
});
