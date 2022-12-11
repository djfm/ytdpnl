import React, {useEffect, useState} from 'react';

import type Recommendation from './models/Recommendation';
import {isOnVideoPage} from './lib';
import scrapeRecommendations from './scraper';

const App: React.FC = () => {
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);

	useEffect(() => {
		const o = new MutationObserver(() => {
			if (!isOnVideoPage()) {
				return;
			}

			// D const videoUrl = window.location.href;

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
	}, [defaultRecommendations]);

	return (
		<ul>{defaultRecommendations.map(rec => (
			<li key={rec.videoId}>{rec.title}</li>
		))}</ul>
	);
};

export default App;
