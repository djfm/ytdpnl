import {type RouteCreator} from '../lib/routeContext';

import ExperimentConfig from '../models/experimentConfig';

export const createGetExperimentConfigRoute: RouteCreator = ({log, dataSource}) => async (_req, res) => {
	log('Received experiment config request');

	const repo = dataSource.getRepository(ExperimentConfig);

	const config = await repo.findOneBy({
		isCurrent: true,
	});

	log('config found:', config);

	if (config) {
		res.status(200).json({
			kind: 'Success',
			value: config,
		});
		return;
	}

	res.status(404).json({kind: 'Failure', message: 'No configuration found on the server, please create one'});
};

export default createGetExperimentConfigRoute;
