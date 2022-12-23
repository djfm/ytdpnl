import React, {useEffect, useState} from 'react';

import type {ExperimentConfig} from './createRecommendationsList';

import RecommendationsListC from './components/RecommendationsListC';
import {log} from './lib';

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');

	const cfg: ExperimentConfig = {
		nonPersonalizedProbability: 0.6,
		arm: 'treatment',
	};

	useEffect(() => {
		if (window.location.href !== currentUrl) {
			log('SETTING CURRENT URL', window.location.href);
			setCurrentUrl(window.location.href);
		}

		const observer = new MutationObserver(() => {
			if (window.location.href !== currentUrl) {
				log('SETTING CURRENT URL AGAIN', window.location.href);
				setCurrentUrl(window.location.href);
			}
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
