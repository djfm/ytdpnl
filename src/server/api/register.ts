import {type RouteCreator} from '../lib/routeContext';

export const createRegisterRoute: RouteCreator = () => async (_req, res) => {
	res.status(403).send('Not implemented');
};

export default createRegisterRoute;
