import {type RouteCreator} from '../lib/routeContext';

import Participant, {ExperimentArm} from '../models/participant';
import ExperimentConfig from '../models/experimentConfig';

import type {ExperimentConfig as Config} from '../../extension/createRecommendationsList';

export const createGetParticipantConfigRoute: RouteCreator = ({log, dataSource}) => async (req, res) => {
	log('Received get participant config request');

	const participantRepo = dataSource.getRepository(Participant);
	const configRepo = dataSource.getRepository(ExperimentConfig);

	const config = await configRepo.findOneBy({
		isCurrent: true,
	});

	if (!config) {
		log('No current config found');
		res.status(500).json({kind: 'Failure', message: 'No current config found'});
		return;
	}

	const participant = await participantRepo.findOneBy({
		code: req.participantCode,
	});

	if (!participant) {
		log('No participant found');
		res.status(500).json({kind: 'Failure', message: 'No participant found'});
		return;
	}

	const arm = participant.arm === ExperimentArm.CONTROL ? 'control' : 'treatment';
	const {nonPersonalizedProbability} = config;

	const result: Config = {
		arm,
		nonPersonalizedProbability,
	};

	log('Sending participant config', result);

	res.send({kind: 'Success', value: result});
};

export default createGetParticipantConfigRoute;
