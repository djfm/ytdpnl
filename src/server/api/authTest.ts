import {type RouteCreator} from '../lib/routeContext';

export const createAuthTestRoute: RouteCreator = ({log}) => async (_req, res) => {
	log('Received auth test request');

	res.json({kind: 'Success', value: 'Authenticated'});
};

export default createAuthTestRoute;
