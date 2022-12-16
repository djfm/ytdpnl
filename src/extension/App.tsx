import React, {useEffect, useState} from 'react';

import type Recommendation from './models/Recommendation';
import type {ExperimentConfig} from './createRecommendationsList';

import {memoizeTemporarily} from './util';
import {isOnVideoPage} from './lib';
import scrapeRecommendations from './scraper';
import fetchNonPersonalizedRecommendations from './recommendationsFetcher';
import createRecommendationsList from './createRecommendationsList';

const fetchNpRecommendations = memoizeTemporarily(1000)(
	fetchNonPersonalizedRecommendations,
);

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedRecommendations, setNonPersonalizedRecommendations] = useState<Recommendation[]>([]);
	const [finalRecommendations, setFinalRecommendations] = useState<Recommendation[]>([]);

	const limit = 15;

	const cfg: ExperimentConfig = {
		nonPersonalizedProbability: 0.6,
		arm: 'treatment',
	};

	const updateFinalRecommendations = () => {
		setFinalRecommendations(
			createRecommendationsList(cfg)(
				nonPersonalizedRecommendations,
				defaultRecommendations,
			),
		);
	};

	useEffect(() => {
		const o = new MutationObserver(async () => {
			if (!isOnVideoPage()) {
				return;
			}

			const videoUrl = window.location.href;

			const urlChanged = videoUrl !== currentUrl;

			if (urlChanged) {
				setCurrentUrl(videoUrl);
				const np = await fetchNpRecommendations(videoUrl);
				setNonPersonalizedRecommendations(np);
				updateFinalRecommendations();
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
			setDefaultRecommendations(recs);
			updateFinalRecommendations();

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

			<h1>Recommendations</h1>
			<ul>{finalRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>
		</div>
	);
};

export default App;
