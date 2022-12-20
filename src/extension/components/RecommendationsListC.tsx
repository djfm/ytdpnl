import React, {useEffect, useState} from 'react';

import type Recommendation from '../models/Recommendation';
import type {ExperimentConfig} from '../createRecommendationsList';
import createRecommendationsList from '../createRecommendationsList';

import {
	fetchNonPersonalizedRecommendations,
	fetchDefaultRecommendations,
} from '../recommendationsFetcher';

import RecommendationC from './RecommendationC';

import {memoizeTemporarily} from '../../util';

const memo = memoizeTemporarily(1000);

const fetchDefault = memo(fetchDefaultRecommendations);
const fetchPersonalized = memo(fetchNonPersonalizedRecommendations);

export const RecommendationsListC: React.FC<{url: string; cfg: ExperimentConfig}> = ({url, cfg}) => {
	const [nonPersonalizedRecommendations, setNonPersonalizedRecommendations] = useState<Recommendation[]>([]);
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedLoading, setNonPersonalizedLoading] = useState<boolean>(true);
	const [defaultLoading, setDefaultLoading] = useState<boolean>(true);

	const loading = nonPersonalizedLoading || defaultLoading;
	const loaded = !loading;

	// Warning: this is not deterministic
	const finalRecommendations = createRecommendationsList(cfg)(
		nonPersonalizedRecommendations,
		defaultRecommendations,
	);

	useEffect(() => {
		setNonPersonalizedLoading(true);
		setDefaultLoading(true);

		fetchPersonalized(url).then(recommendations => {
			setNonPersonalizedRecommendations(recommendations);
			setNonPersonalizedLoading(false);
		}).catch(err => {
			console.error('Error fetching non personalized recommendations', err);
		});

		fetchDefault(url).then(recommendations => {
			setDefaultRecommendations(recommendations);
			setDefaultLoading(false);
		}).catch(err => {
			console.error('Error fetching default recommendations', err);
		});
	}, [url]);

	const debugUi = (
		<div>
			<h1>Debug view</h1>

			<h2>Non-personalized recommendations</h2>
			<ul>{nonPersonalizedRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>

			<h2>Personalized recommendations</h2>
			<ul>{defaultRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>

			<h2>Final recommendations</h2>
			<ul>{finalRecommendations.map(rec => (
				<li key={rec.videoId}>{rec.title}</li>
			))}</ul>
		</div>
	);

	const loadedUi = (
		<div>
			{finalRecommendations.map(rec => <RecommendationC key={rec.videoId} {...rec} />)}
		</div>
	);

	return (
		<div>
			{loading && (<p>Loading...</p>)}
			{loaded && loadedUi}
			{loaded && debugUi}
		</div>
	);
};

export default RecommendationsListC;
