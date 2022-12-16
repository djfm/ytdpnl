import type Recommendation from './models/Recommendation';

export type ExperimentConfig = {
	arm: 'control' | 'treatment';
	nonPersonalizedProbability: number;
};

export type RecommendationsListCreator = (cfg: ExperimentConfig) =>
(nonPersonalized: Recommendation[], personalized: Recommendation[]) =>
Recommendation[];

export const createRecommendationsList: RecommendationsListCreator = cfg =>
	(nonPersonalized, personalized) => {
		const limit = Math.min(personalized.length, nonPersonalized.length);

		const result: Recommendation[] = [];
		const unused: Recommendation[] = [];

		for (let i = 0; i < limit; i++) {
			const takeNonPersonalized = Math.random() < cfg.nonPersonalizedProbability;

			if (takeNonPersonalized) {
				result.push(nonPersonalized[i]);
				unused.push(personalized[i]);
			} else {
				result.push(personalized[i]);
				unused.push(nonPersonalized[i]);
			}
		}

		return result.concat(unused);
	};

export default createRecommendationsList;
