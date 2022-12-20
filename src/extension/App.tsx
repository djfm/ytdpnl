import React, {useEffect, useState} from 'react';

import type Recommendation from './models/Recommendation';
import type {ExperimentConfig} from './createRecommendationsList';

import {memoizeTemporarily} from './util';
import scrapeRecommendations from './scraper';
import fetchNonPersonalizedRecommendations from './recommendationsFetcher';
import createRecommendationsList from './createRecommendationsList';

const fetchNpRecommendations = memoizeTemporarily(1000)(
	fetchNonPersonalizedRecommendations,
);

const sameList = (a: Recommendation[]) => (b: Recommendation[]) => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i].videoId !== b[i].videoId) {
			return false;
		}
	}

	return true;
};

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedRecommendations, setNonPersonalizedRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedLoading, setNonPersonalizedLoading] = useState<boolean>(true);
	const [defaultLoading, setDefaultLoading] = useState<boolean>(true);

	const limit = 15;
	const loading = nonPersonalizedLoading || defaultLoading;
	const loaded = !loading;

	const cfg: ExperimentConfig = {
		nonPersonalizedProbability: 0.6,
		arm: 'treatment',
	};

	const finalRecommendations = createRecommendationsList(cfg)(
		nonPersonalizedRecommendations,
		defaultRecommendations,
	);

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, []);

	useEffect(() => {
		const o = new MutationObserver(async () => {
			const {href} = window.location;
			if (href !== currentUrl) {
				console.log('[URL CHANGED] setting current url', href);
				setCurrentUrl(href);
			}

			const related = document.querySelector('#related');

			if (!related) {
				return;
			}

			const recommendationsContainer = document.querySelector(
				'ytd-watch-next-secondary-results-renderer',
			);

			const recs = scrapeRecommendations(recommendationsContainer as HTMLElement);

			if (!sameList(recs)(defaultRecommendations)) {
				if (recs.length >= limit) {
					setDefaultRecommendations(recs);
					setDefaultLoading(false);
					console.log('default recommendations (with cookies)', recs);
				}
			}
		});

		o.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			o.disconnect();
		};
	});

	useEffect(() => {
		if (currentUrl) {
			console.log('[URL CHANGED] CHANGE OF PAGE EVENT', currentUrl);
			setDefaultLoading(true);
			setNonPersonalizedLoading(true);

			setDefaultRecommendations([]);
			setNonPersonalizedRecommendations([]);

			(async () => {
				const np = await fetchNpRecommendations(currentUrl);
				setNonPersonalizedRecommendations(np);
				setNonPersonalizedLoading(false);
				console.log('non-personalized recommendations', np);
			})();
		}
	}, [currentUrl]);

	useEffect(() => {
		if (loaded) {
			console.info('[DONE LOADING] final recommendations', finalRecommendations);
		}
	}, [finalRecommendations]);

	return (
		<div>
			{loading && (<p>Loading...</p>)}
			{loaded && (
				<div>
					<h1>Personalized recommendations</h1>
					<ul>{defaultRecommendations.map(rec => (
						<li key={rec.videoId}>{rec.title}</li>
					))}</ul>

					<h1>Non-personalized recommendations</h1>
					<ul>{nonPersonalizedRecommendations.map(rec => (
						<li key={rec.videoId}>{rec.title}</li>
					))}</ul>

					<h1>Recommendations</h1>
					<ul>{finalRecommendations.map(rec => (
						<li key={rec.videoId}>{rec.title}</li>
					))}</ul>
				</div>
			)}
		</div>
	);
};

export default App;
