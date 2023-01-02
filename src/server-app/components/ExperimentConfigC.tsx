import React, {useState, useEffect} from 'react';

import {
	Box,
	Grid,
	Button,
	Typography,
	FormControl,
	TextField,
	FormHelperText,
} from '@mui/material';

import {StatusMessageC} from './MessageC';

import ExperimentConfig from '../../server/models/experimentConfig';

import {useAdminApi} from '../adminApiProvider';

export const ExperimentConfigC = () => {
	const [info, setInfo] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const [error, setError] = useState<string | undefined>();
	const [config, setConfig] = useState<ExperimentConfig>(new ExperimentConfig());
	const api = useAdminApi();
	const [probaField, setProbaField] = useState<string>('');

	useEffect(() => {
		(async () => {
			setInfo('Loading experiment config...');

			const config = await api.getExperimentConfig();

			if (config.kind === 'Success') {
				setConfig(config.value);
				setProbaField(config.value.nonPersonalizedProbability.toString());
				setInfo(undefined);
			} else {
				setInfo(config.message);
			}
		})();
	}, []);

	const handleProbabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProbaField(event.target.value);

		const proba = parseFloat(event.target.value);

		if (proba <= 1 && proba >= 0) {
			setError(undefined);
			setConfig({
				...config,
				nonPersonalizedProbability: parseFloat(event.target.value),
			});
		} else {
			setError('Probability must be between 0 and 1');
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setInfo('Saving config...');
		setError(undefined);
		setSuccess(undefined);

		(async () => {
			const response = await api.postExperimentConfig(config);

			if (response.kind === 'Success') {
				setSuccess('Config saved');
				setConfig(response.value);
				setProbaField(response.value.nonPersonalizedProbability.toString());
			} else {
				setError(response.message);
			}
		})();

		console.log('Saving config', config);
	};

	const ui = (
		<Box>
			<Typography variant='h1' sx={{mb: 4}}>
				Experiment Config
			</Typography>

			<Typography sx={{my: 4}}>Versions of the configuration are all kept in the database.</Typography>

			<StatusMessageC {...{info, success, error}} sx={{mb: 4}}/>

			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<form onSubmit={handleSubmit}>
						<Box sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
						}}>
							<FormControl>
								<TextField
									label='Non-personalized probability'
									type='number'
									inputProps={{min: 0, max: 1, step: 0.01}}
									id='nonPersonalizedProbability'
									value={probaField}
									onChange={handleProbabilityChange}
								/>
								<FormHelperText>
									Probability of showing a non-personalized recommendation
								</FormHelperText>
							</FormControl>
							<FormControl>
								<TextField
									label='Comment about this version of the configuration'
									id='comment'
									value={config.comment}
									onChange={e => {
										setConfig({...config, comment: e.target.value});
									}}
								/>
							</FormControl>
							<FormHelperText>
								Useful to remember why you changed the config
							</FormHelperText>
							<Box>
								<Button type='submit' variant='contained' sx={{mt: 2}}>
									Save
								</Button>
							</Box>
						</Box>
					</form>
				</Grid>
			</Grid>
		</Box>
	);

	return ui;
};

export default ExperimentConfigC;
