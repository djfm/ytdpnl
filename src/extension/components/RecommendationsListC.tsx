import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';

import type Recommendation from '../models/Recommendation';
import type {ExperimentConfig} from '../createRecommendationsList';
import createRecommendationsList from '../createRecommendationsList';

import {
	fetchNonPersonalizedRecommendations,
	fetchDefaultRecommendations,
} from '../recommendationsFetcher';

import RecommendationC from './RecommendationC';

import {memoizeTemporarily, setPersonalizedFlags} from '../../util';

const memo = memoizeTemporarily(10000);

const fetchDefault = memo(fetchDefaultRecommendations);
const fetchPersonalized = memo(fetchNonPersonalizedRecommendations);

const NonPersonalized = styled('span')(() => ({
	color: 'green',
}));

const Personalized = styled('span')(() => ({
	color: 'red',
}));

const Mixed = styled('span')(() => ({
	color: 'black',
}));

const debugWrapper = (r: Recommendation) => {
	const {personalization} = r;

	if (personalization === 'non-personalized') {
		return NonPersonalized;
	}

	if (personalization === 'personalized') {
		return Personalized;
	}

	return Mixed;
};

export const RecommendationsListC: React.FC<{url: string; cfg: ExperimentConfig}> = ({url, cfg}) => {
	const [nonPersonalizedRecommendations, setNonPersonalizedRecommendations] = useState<Recommendation[]>([]);
	const [defaultRecommendations, setDefaultRecommendations] = useState<Recommendation[]>([]);
	const [nonPersonalizedLoading, setNonPersonalizedLoading] = useState<boolean>(true);
	const [defaultLoading, setDefaultLoading] = useState<boolean>(true);
	const [finalRecommendations, setFinalRecommendations] = useState<Recommendation[]>([]);

	const loading = nonPersonalizedLoading || defaultLoading;
	const loaded = !loading;

	useEffect(() => {
		if (!url) {
			return;
		}

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

	useEffect(() => {
		if (!loaded || !url) {
			return;
		}

		const [np, p] = setPersonalizedFlags(nonPersonalizedRecommendations, defaultRecommendations);

		setFinalRecommendations(createRecommendationsList(cfg)(np, p));

		console.log('LOADED!', url);
	}, [loaded, nonPersonalizedRecommendations, defaultRecommendations]);

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
			<p>Arm: {cfg.arm}<br/></p>
			<p><NonPersonalized>Non-personalized</NonPersonalized></p>
			<p><Personalized>Personalized</Personalized></p>
			<p><Mixed>Mixed</Mixed></p>
			<p><br/></p>
			<ul>{finalRecommendations.map(rec => {
				const W = debugWrapper(rec);
				return (<li key={rec.videoId}><W>{rec.title}</W></li>);
			})}</ul>
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
