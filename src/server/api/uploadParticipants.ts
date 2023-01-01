import {type RouteCreator} from '../lib/routeContext';

export const createUploadParticipantsRoute: RouteCreator = ({log}) => async (req, res) => {
	log('Received upload participants request');

	const participants = req?.file?.buffer.toString('utf-8');

	if (!participants) {
		log('no participants received');
		res.status(400).json({kind: 'Failure', message: 'No participants file'});
		return;
	}

	log('participants received');

	res.status(400).json({kind: 'Failure', message: 'Not implemented'});
};

export default createUploadParticipantsRoute;
