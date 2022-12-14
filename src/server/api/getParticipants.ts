import {type RouteCreator} from '../lib/routeContext';

import {type Page, extractPaginationRequest} from '../lib/pagination';

import Participant from '../models/participant';

export const createGetParticipantsRoute: RouteCreator = ({createLogger, dataSource}) => async (req, res) => {
	const log = createLogger(req.requestId);
	log('Received participants request');

	const {page, pageSize} = extractPaginationRequest(req);

	const participantRepo = dataSource.getRepository(Participant);

	try {
		const participants = await participantRepo
			.find({
				skip: page * pageSize,
				take: pageSize,
				order: {
					createdAt: 'DESC',
				},
			});

		const count = await participantRepo.count();

		const data: Page<Participant> = {
			results: participants,
			page,
			pageSize,
			pageCount: Math.ceil(count / pageSize),
		};

		res.status(200).json({kind: 'Success', value: data});
	} catch (error) {
		log('Error getting participants', error);

		res.status(500).json({kind: 'Error', value: 'Error getting participants'});
	}
};

export default createGetParticipantsRoute;
