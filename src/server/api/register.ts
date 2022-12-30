import crypto from 'crypto';
import bcrypt from 'bcrypt';

import {type RouteCreator} from '../lib/routeContext';

import Admin from '../models/admin';
import {validateExcept, type Maybe, getMessage, has} from '../../util';

import {getVerifyEmailToken} from '../routes';

import whitelist from '../../../adminsWhitelist';

import config from '../../../config.extension';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

if (!has(`${env}-server-url`)(config)) {
	throw new Error(`Missing ${env}-server-url in config`);
}

const serverUrl = config[`${env}-server-url`];

const randomToken = () => crypto.randomBytes(128).toString('hex');

export const hashPassword = async (password: string): Promise<string> => new Promise((resolve, reject) => {
	bcrypt.hash(password, 10, (err, hash) => {
		if (err) {
			reject(err);
			return;
		}

		resolve(hash);
	});
});

export const createRegisterRoute: RouteCreator = ({dataSource, mailer, mailerFrom, log}) => async (req, res) => {
	const admin = new Admin();
	Object.assign(admin, req.body);
	// TODO: extract this to a function
	// that inflates received models in one call
	admin.createdAt = new Date();
	admin.updatedAt = new Date();
	admin.password = await hashPassword(admin.password);
	log('Received admin for registration (password is hashed):', admin);

	const errors = await validateExcept('id', 'verificationToken')(admin);

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

	const repo = dataSource.getRepository(Admin);

	const existing = await repo.findOneBy({email: admin.email});

	if (existing) {
		res.status(400).json({
			kind: 'Failure',
			message: 'Email already registered',
		});
		return;
	}

	const token = randomToken();
	admin.verificationToken = token;

	try {
		await repo.save(admin);
	} catch (e) {
		res.status(500).json({
			kind: 'Failure',
			message: getMessage(e, 'Unknown database error'),
		});
		return;
	}

	const link = `${serverUrl}${getVerifyEmailToken}?token=${token}`;

	try {
		const mailInfo = await mailer.sendMail({
			from: mailerFrom,
			to: admin.email,
			subject: 'Please verify your email address for YTDNPL admin',
			text: `Please past the following link in your browser to verify your email address: ${link}`,
			html: `Please click <a href="${link}">here</a> to verify your email address.`,
		}) as unknown;

		log('E-mail sent:', mailInfo);

		res.status(200).json({
			kind: 'Success',
			value: 'Admin registered, please validate your account by clicking the link in the email you should receive shortly. Please check your spam folder if you don\'t see it in your inbox.',
		});
	} catch (e) {
		res.status(500).json({
			kind: 'Failure',
			message: getMessage(e, 'Unknown mailer error'),
		});
	}
};

export default createRegisterRoute;
