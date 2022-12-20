import React, {useEffect, useState} from 'react';

import type {ExperimentConfig} from './createRecommendationsList';

import RecommendationsListC from './components/RecommendationsListC';

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const cfg: ExperimentConfig = {
		nonPersonalizedProbability: 0.6,
		arm: 'treatment',
	};

	useEffect(() => {
		setCurrentUrl(window.location.href);

		const observer = new MutationObserver(() => {
			setCurrentUrl(window.location.href);
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
		};
	});

	return (<RecommendationsListC url={currentUrl} cfg={cfg} />);
};

export default App;
