import {type RouteCreator} from '../lib/routeContext';

import ExperimentConfig from '../models/experimentConfig';
import {validateNew} from '../../util';

export const createPostExperimentConfigRoute: RouteCreator = ({log, dataSource}) => async (_req, res) => {
	log('Received create experiment config request');

	const config = new ExperimentConfig();
	const {id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data} = _req.body as ExperimentConfig;
	Object.assign(config, data);

	log('config received:', config);

	const errors = await validateNew(config);

	if (errors.length > 0) {
		res.status(400).json({kind: 'Failure', message: `${errors.join(', ')}`});
		return;
	}

	await dataSource.transaction(async transaction => {
		const repo = transaction.getRepository(ExperimentConfig);

		try {
			const currentConfig = await repo.findOneBy({
				isCurrent: true,
			});

			if (currentConfig) {
				currentConfig.isCurrent = false;
				currentConfig.updatedAt = new Date();
				await repo.save(currentConfig);
			}

			config.isCurrent = true;
			await repo.save(config);

			res.status(200).json({kind: 'Success', value: config});
		} catch (error) {
			log('Error while saving config:', error);
			res.status(500).json({kind: 'Failure', message: 'An error occurred while saving the configuration'});
		}
	});
};

export default createPostExperimentConfigRoute;
