import {type RouteCreator} from '../lib/routeContext';

import Admin from '../models/admin';
import {validateNew, type Maybe} from '../../util';

import whitelist from '../../../adminsWhitelist';

export const createRegisterRoute: RouteCreator = () => async (req, res) => {
	const admin = new Admin();
	Object.assign(admin, req.body);
	// TODO: extract this to a function
	// that inflates received models in one call
	admin.createdAt = new Date(admin.createdAt);
	admin.updatedAt = new Date(admin.updatedAt);
	console.log(admin);

	const errors = await validateNew(admin);

	if (errors.length > 0) {
		const err: Maybe<Admin> = {
			kind: 'Failure',
			message: `Invalid entity received from client: ${errors.join(', ')}`,
		};

		res.status(400).json(err);
		return;
	}

	if (!whitelist.has(admin.email)) {
		const err: Maybe<Admin> = {
			kind: 'Failure',
			message: 'Email not whitelisted',
		};

		res.status(403).json(err);
		return;
	}

	console.log(req.body);

	const err: Maybe<Admin> = {
		kind: 'Failure',
		message: 'Not implemented',
	};

	res.status(403).send(err);
};

export default createRegisterRoute;
