import {type RouteCreator} from '../lib/routeContext';

import Participant from '../models/participant';
import Event from '../models/event';
import ExperimentConfig from '../models/experimentConfig';

import {validateNew} from '../../util';

export const createPostEventRoute: RouteCreator = ({log, dataSource}) => async (req, res) => {
	log('Received post event request');

	const {sessionUuid, participantCode} = req;

	if (sessionUuid === undefined) {
		log('No session UUID found');
		res.status(500).json({kind: 'Failure', message: 'No session UUID found'});
		return;
	}

	if (participantCode === undefined) {
		log('No participant code found');
		res.status(500).json({kind: 'Failure', message: 'No participant code found'});
		return;
	}

	const event = new Event();
	Object.assign(event, req.body);
	event.sessionUuid = sessionUuid;
	event.createdAt = new Date();
	event.updatedAt = new Date();

	const participantRepo = dataSource.getRepository(Participant);

	if (!event.arm) {
		const participant = await participantRepo.findOneBy({
			code: participantCode,
		});

		if (!participant) {
			log('no participant found');
			res.status(500).json({kind: 'Failure', message: 'No participant found'});
			return;
		}

		event.arm = participant.arm;
	}

	if (!event.experimentConfigId) {
		const configRepo = dataSource.getRepository(ExperimentConfig);
		const config = await configRepo.findOneBy({
			isCurrent: true,
		});

		if (!config) {
			log('no current config found');
			res.status(500).json({kind: 'Failure', message: 'No current config found'});
			return;
		}

		event.experimentConfigId = config.id;
	}

	const errors = await validateNew(event);

	if (errors.length > 0) {
		log('event validation failed', errors);
		res.status(400).json({kind: 'Failure', message: `Event validation failed: ${errors.join(', ')}.`});
		return;
	}

	try {
		const eventRepo = dataSource.getRepository(Event);
		const e = await eventRepo.save(event);
		log('event saved', e);
		res.send({kind: 'Success', value: e});
	} catch (e) {
		log('event save failed', e);
		res.status(500).json({kind: 'Failure', message: 'Event save failed'});
	}
};

export default createPostEventRoute;
