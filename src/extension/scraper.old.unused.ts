import type Recommendation from './models/Recommendation';

import {dedupe} from './createRecommendationsList';

const scrapeRecommendations = (container: HTMLElement): Recommendation[] => {
	if (!container) {
		return [];
	}

	const recommendations = container.querySelectorAll('ytd-compact-video-renderer');
	const recommendationsArray = Array.from(recommendations);

	const scraped = recommendationsArray.map(recommendation => {
		const title = recommendation.querySelector('#video-title');

		if (!title?.textContent) {
			return null;
		}

		const channelName = recommendation.querySelector('ytd-channel-name #text');

		if (!channelName?.textContent) {
			return null;
		}

		const link = recommendation.querySelector('a.yt-simple-endpoint');

		if (!link) {
			return null;
		}

		const url = link.getAttribute('href');

		if (!url) {
			return null;
		}

		const idExp = /watch\?v=(.+)$/;
		const videoId = idExp.exec(url)?.[1];

		if (!videoId) {
			return null;
		}

		const metadataLine = recommendation.querySelector('#metadata-line');

		if (!metadataLine) {
			return null;
		}

		const views = metadataLine.querySelector('span:nth-of-type(1)');
		const publishedSince = metadataLine.querySelector('span:nth-of-type(2)');

		if (!views?.textContent || !publishedSince?.textContent) {
			return null;
		}

		const result: Recommendation = {
			title: title.textContent.trim(),
			channelName: channelName.textContent.trim(),
			url,
			videoId,
			views: views.textContent.trim(),
			publishedSince: publishedSince.textContent.trim(),
			miniatureUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
			hoverAnimationUrl: `https://i.ytimg.com/an_webp/${videoId}/mqdefault_6s.webp`,
			isPersonalized: true,
		};

		return result;
	});

	return dedupe(scraped.filter(Boolean) as Recommendation[]);
};

export default scrapeRecommendations;
