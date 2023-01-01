import {type RouteCreator} from '../lib/routeContext';

import type {Page} from '../lib/pagination';

import Participant from '../models/participant';

export const createGetParticipantsRoute: RouteCreator = ({log, dataSource}) => async (req, res) => {
	log('Received participants request');

	const {page} = req.params;
	const pageNumber = (page === undefined || !Number.isInteger(Number(page))) ? 0 : Number(page);
	const {pageSize} = req.query;
	const pageSizeNumber = (pageSize === undefined || !Number.isInteger(Number(pageSize))) ? 15 : Math.min(Number(pageSize), 30);

	const participantRepo = dataSource.getRepository(Participant);

	const participants = await participantRepo
		.find({
			skip: pageNumber * pageSizeNumber,
			take: pageSizeNumber,
		});

	const count = await participantRepo.count();

	const data: Page<Participant> = {
		results: participants,
		page: pageNumber,
		pageSize: pageSizeNumber,
		pageCount: Math.ceil(count / pageSizeNumber),
	};

	res.status(200).json({kind: 'Success', value: data});
};

export default createGetParticipantsRoute;
