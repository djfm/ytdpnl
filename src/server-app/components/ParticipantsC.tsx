import React, {useState, useRef} from 'react';

import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Typography,
} from '@mui/material';

import FileIcon from '@mui/icons-material/FileUpload';

import DLinkC from './DownloadLinkC';
import {StatusMessageC} from './MessageC';

import {useAdminApi} from '../adminApiProvider';

// @ts-expect-error this is a text file, not a module
import csvSample from '../../server/public/participants.sample.csv';

export const UploadForm: React.FC = () => {
	const exampleString = csvSample as string;

	const [info, setInfo] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);
	const form = useRef<HTMLFormElement>(null);

	const api = useAdminApi();

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];

		if (!file) {
			return;
		}

		(async () => {
			setInfo('Uploading...');
			setError(undefined);
			setSuccess(undefined);

			const res = await api.uploadParticipants(file);

			if (res.kind === 'Success') {
				setSuccess(res.value);
			} else {
				setError(res.message);
			}

			if (form.current) {
				form.current.reset();
			}
		})();
	};

	const example = (
		<Box sx={{mb: 4}}>
			<Typography>
				<strong>Example file:</strong>
				&nbsp;<DLinkC href='/participants.sample.csv'>(download)</DLinkC>
			</Typography>
			<pre style={{marginTop: 0, maxWidth: '100%', overflow: 'auto'}}>
				{exampleString}
			</pre>
		</Box>
	);

	const ui = (
		<section>
			<Typography variant='h2' sx={{mb: 2}}>Add Participants</Typography>
			<Typography variant='body1' component='div' sx={{mb: 2}}>
				You can add participants to the experiment by uploading a CSV file,
				it should have at least the following 3 columns:
				<ul>
					<li>email</li>
					<li>code</li>
					<li>arm</li>
				</ul>
				where &quot;arm&quot; is either
				&quot;control&quot; or &quot;treatment&quot;.
				<p>
					<strong>Note:</strong> The &quot;code&quot; column should contain
					large random values so that participant codes cannot be guessed.
				</p>
			</Typography>
			{example}
			<form ref={form}>
				<FormControl sx={{mb: 2}}>
					<Button
						component='label'
						variant='outlined'
						htmlFor='list'
						endIcon={<FileIcon/>}
					>
						Upload CSV
						<input
							hidden
							type='file'
							id='list'
							name='list'
							accept='.csv'
							onChange={onFileChange}
						/>
					</Button>
					<FormHelperText>
						The separator must be a comma.
					</FormHelperText>
				</FormControl>
				<StatusMessageC {...{info, error, success}}/>
			</form>
		</section>
	);

	return ui;
};

export const ParticipantsC: React.FC = () => (
	<div>
		<Typography variant='h1' sx={{mb: 4}}>Participants</Typography>
		<UploadForm />
	</div>
);

export default ParticipantsC;
