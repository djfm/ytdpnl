import type Recommendation from './models/Recommendation';

export type ExperimentConfig = {
	arm: 'control' | 'treatment';
	nonPersonalizedProbability: number;
};

export type RecommendationsListCreator = (cfg: ExperimentConfig) =>
(nonPersonalized: Recommendation[], personalized: Recommendation[]) =>
Recommendation[];

// Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
};

const removeDuplicates = <T>(array: T[]): T[] => [...new Set(array)] as T[];

export const createRecommendationsList: RecommendationsListCreator = cfg =>
	(nonPersonalized, personalized) => {
		const limit = Math.min(personalized.length, nonPersonalized.length);

		const tmpResult: Recommendation[] = [];
		const unused: Recommendation[] = [];

		for (let i = 0; i < limit; i++) {
			const takeNonPersonalized = Math.random() < cfg.nonPersonalizedProbability;

			if (takeNonPersonalized) {
				tmpResult.push(nonPersonalized[i]);
				unused.push(personalized[i]);
			} else {
				tmpResult.push(personalized[i]);
				unused.push(nonPersonalized[i]);
			}
		}

		return removeDuplicates(tmpResult.concat(shuffleArray(unused)));
	};

export default createRecommendationsList;
