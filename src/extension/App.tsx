import React, {useEffect, useState} from 'react';

import {
	Box,
	Button,
	TextField,
	Typography,
	FormHelperText,
} from '@mui/material';

import type {ParticipantConfig} from '../server/api/participantConfig';

import MessageC from '../server-app/components/MessageC';

import RecommendationsListC from './components/RecommendationsListC';
import {log} from './lib';

import {useApi} from './apiProvider';

const App: React.FC = () => {
	const localCode = localStorage.getItem('participantCode') ?? '';
	const [currentUrl, setCurrentUrl] = useState<string>('');
	const [participantCode, setParticipantCode] = useState<string>(localCode);
	const [participantCodeValid, setParticipantCodeValid] = useState<boolean>(localCode !== '');
	const [error, setError] = useState<string | undefined>();
	const [cfg, setCfg] = useState<ParticipantConfig | undefined>();

	const api = useApi();

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

	useEffect(() => {
		if (participantCode === '') {
			return;
		}

		api.getConfig().then(c => {
			if (c.kind === 'Success') {
				setCfg(c.value);
			} else {
				console.error('Could not get config:', c.message);
			}
		}).catch(console.error);
	}, [currentUrl]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(undefined);

		if (participantCode === undefined) {
			return;
		}

		const valid = await api.checkParticipantCode(participantCode);

		if (!valid) {
			setError('Invalid participant code');
			return;
		}

		setParticipantCodeValid(true);
		api.setAuth(participantCode);
		api.newSession().catch(console.error);
	};

	if (!participantCodeValid) {
		return (
			<form onSubmit={handleSubmit}>
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
					<MessageC message={error} type='error' />
				</Box>
			</form>
		);
	}

	if (!cfg) {
		return (
			<Typography>Loading config...</Typography>
		);
	}

	return (<RecommendationsListC url={currentUrl} cfg={cfg} />);
};

export default App;
