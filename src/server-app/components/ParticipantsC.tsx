import React from 'react';

import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Typography,
} from '@mui/material';

import FileIcon from '@mui/icons-material/FileUpload';

import DLinkC from './DownloadLinkC';

// @ts-expect-error this is a text file, not a module
import csvSample from '../../server/public/participants.sample.csv';

export const ParticipantsC: React.FC = () => {
	const exampleString = csvSample as string;

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
		<div>
			<Typography variant='h1' sx={{mb: 4}}>Participants</Typography>

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
				<form>
					<FormControl sx={{mb: 2}}>
						<Button
							component='label'
							variant='outlined'
							htmlFor='list'
							endIcon={<FileIcon/>}
						>
							Upload CSV
							<input hidden type='file' id='list' name='list' accept='.csv'/>
						</Button>
						<FormHelperText>
							The separator must be a comma.
						</FormHelperText>
					</FormControl>
				</form>
			</section>
		</div>
	);

	return ui;
};

export default ParticipantsC;
