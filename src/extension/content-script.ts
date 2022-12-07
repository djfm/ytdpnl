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

const observer = new MutationObserver(() => {
	const videoUrl = window.location.href;

	if (isOnVideoPage()) {
		onVideoMightHaveChanged(videoUrl);
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});
