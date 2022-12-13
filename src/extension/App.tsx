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

			const urlChanged = videoUrl !== currentUrl;

			const limit = 15;

			if (urlChanged) {
				setCurrentUrl(videoUrl);
				const np = await fetchNonPersonalizedRecommendations(videoUrl);
				setNonPersonalizedRecommendations(np.slice(0, limit));
				console.log('NP RECOMMENDATIONS FETCHED', np);
			}

			if (!urlChanged && defaultRecommendations.length >= limit) {
				return;
			}

			const related = document.querySelector('#related');

			if (!related) {
				return;
			}

			const recommendationsContainer = document.querySelector('ytd-watch-next-secondary-results-renderer');
			const recs = scrapeRecommendations(recommendationsContainer as HTMLElement);
			setDefaultRecommendations(recs.slice(0, limit));

			console.log({defaultRecommendations});
		});

		o.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			o.disconnect();
		};
	});

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
