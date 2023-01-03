import {type DataSource, type Repository} from 'typeorm';

import {type RouteCreator} from '../lib/routeContext';
import {type LogFunction} from '../lib/logger';

import Participant from '../models/participant';
import Event, {EventType} from '../models/event';
import {type RecommendationsEvent} from '../models/recommendationsEvent';
import ExperimentConfig from '../models/experimentConfig';
import Video from '../models/video';

import type Recommendation from '../../extension/models/Recommendation';

import {validateNew} from '../../util';

const storeVideos = async (repo: Repository<Video>, videos: Video[]): Promise<number[]> => {
	const ids: number[] = [];

	for (const video of videos) {
		// eslint-disable-next-line no-await-in-loop
		const existing = await repo.findOneBy({
			youtubeId: video.youtubeId,
		});

		if (existing) {
			ids.push(existing.id);
		} else {
			const newVideo = new Video();
			Object.assign(newVideo, video);
			// eslint-disable-next-line no-await-in-loop
			await validateNew(newVideo);
			// eslint-disable-next-line no-await-in-loop
			const saved = await repo.save(newVideo);
			ids.push(saved.id);
		}
	}

	return ids;
};

const makeVideos = (recommendations: Recommendation[]): Video[] =>
	recommendations.map(r => {
		const v = new Video();
		v.youtubeId = r.videoId;
		v.title = r.title;
		v.url = r.url;
		return v;
	});

const storeRecommendationsShown = async (
	log: LogFunction,
	dataSource: DataSource,
	event: RecommendationsEvent,
) => {
	log('Storing recommendations shown event meta-data');

	const videoRepo = dataSource.getRepository(Video);

	const nonPersonalized = await storeVideos(videoRepo, makeVideos(event.nonPersonalized));
	const personalized = await storeVideos(videoRepo, makeVideos(event.personalized));
	const shown = await storeVideos(videoRepo, makeVideos(event.shown));

	log('Non-personalized', nonPersonalized);
	log('Personalized', personalized);
	log('Shown', shown);
};

export const createPostEventRoute: RouteCreator = ({createLogger, dataSource}) => async (req, res) => {
	const log = createLogger(req.requestId);

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

		if (event.type === EventType.RECOMMENDATIONS_SHOWN) {
			await storeRecommendationsShown(log, dataSource, event as RecommendationsEvent);
		}
	} catch (e) {
		log('event save failed', e);
		res.status(500).json({kind: 'Failure', message: 'Event save failed'});
	}
};

export default createPostEventRoute;
