import type Recommendation from './models/Recommendation';
import {removeDuplicates, shuffleArray} from '../util';

export type ExperimentConfig = {
	arm: 'control' | 'treatment';
	nonPersonalizedProbability: number;
};
export type RandomSource = () => number;

export type RecommendationsListCreator = (cfg: ExperimentConfig, randomSource: RandomSource) =>
(nonPersonalized: Recommendation[], personalized: Recommendation[]) =>
Recommendation[];

export const dedupe = removeDuplicates((r: Recommendation) => r.videoId);

// Do not use Math.random() directly, because it is not deterministic
// and will cause issues with the UI. Instead, an equivalent
// "randomSource" function will be passed in, which provides a deterministic
// list of uniformly distributed random numbers between 0 and 1 for up to 1000 calls.
// The list is generated again on each page load.
export const createRecommendationsList: RecommendationsListCreator = (cfg, randomSource) =>
	(nonPersonalized, personalized) => {
		const limit = Math.min(personalized.length, nonPersonalized.length);

		const tmpResult: Recommendation[] = [];
		const unused: Recommendation[] = [];

		for (let i = 0; i < limit; i++) {
			const takeNonPersonalized = randomSource() < cfg.nonPersonalizedProbability;

			if (takeNonPersonalized) {
				tmpResult.push(nonPersonalized[i]);
				unused.push(personalized[i]);
			} else {
				tmpResult.push(personalized[i]);
				unused.push(nonPersonalized[i]);
			}
		}

		return dedupe(tmpResult.concat(shuffleArray(unused)));
	};

export default createRecommendationsList;
