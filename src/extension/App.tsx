import React, {useEffect, useState} from 'react';

import {
	Box,
	Button,
	TextField,
	Typography,
	FormHelperText,
} from '@mui/material';

import type {ExperimentConfig} from './createRecommendationsList';

import type Participant from '../server/models/participant';

import RecommendationsListC from './components/RecommendationsListC';
import {log} from './lib';

const App: React.FC = () => {
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const [participantCode, setParticipantCode] = useState<string | undefined>();
	const [participant, _setParticipant] = useState<Participant | undefined>();

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

	if (participant === undefined) {
		return (
			<form>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'stretch',
				}}>
					<Typography sx={{mb: 2}}>
						Welcome to the experiment!<br />
						Please enter your participant code to continue.
					</Typography>
					<TextField
						label='Participant Code'
						value={participantCode}
						onChange={e => {
							setParticipantCode(e.target.value);
						}}
					/>
					<FormHelperText>
						This is the code that has been give to you by e-mail.
					</FormHelperText>
					<Button type='submit' variant='contained'>
						Submit
					</Button>
				</Box>
			</form>
		);
	}

	return (<RecommendationsListC url={currentUrl} cfg={cfg} />);
};

export default App;
