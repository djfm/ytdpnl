import {type RouteCreator} from '../lib/routeContext';

export const createGetExperimentConfigRoute: RouteCreator = ({log}) => async (_req, res) => {
	log('Received experiment config request');

	res.status(400).json({kind: 'Error', value: 'Not implemented'});
};

export default createGetExperimentConfigRoute;
