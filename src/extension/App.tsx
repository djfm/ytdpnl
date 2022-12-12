import React, {useEffect, useState} from 'react';

import type Recommendation from './models/Recommendation';
import {isOnVideoPage} from './lib';
import scrapeRecommendations from './scraper';
import fetchNonPersonalizedRecommendations from './recommendationsFetcher';

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedRecommendations, setNonPersonalizedRecommendations] = useState<Recommendation[]>([]);

	useEffect(() => {
		const o = new MutationObserver(async () => {
			if (!isOnVideoPage()) {
				return;
			}

			const videoUrl = window.location.href;

			if (videoUrl !== currentUrl) {
				setCurrentUrl(videoUrl);
				setNonPersonalizedRecommendations(await fetchNonPersonalizedRecommendations(videoUrl));
			}

			const related = document.querySelector('#related');

			if (!related) {
				return;
			}

			const recommendationsContainer = document.querySelector('ytd-watch-next-secondary-results-renderer');
			const recs = scrapeRecommendations(recommendationsContainer as HTMLElement);
			setDefaultRecommendations(recs);

			console.log({defaultRecommendations});
		});

		o.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			o.disconnect();
		};
	}, [currentUrl, defaultRecommendations, nonPersonalizedRecommendations]);

	return (
		<div>
			<h1>Personalized recommendations</h1>
			<ul>{defaultRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>

			<h1>Non-personalized recommendations</h1>
			<ul>{nonPersonalizedRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>
		</div>
	);
};

export default App;
