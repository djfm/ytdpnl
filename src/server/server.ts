import {readFile} from 'fs/promises';
import {join} from 'path';

import express from 'express';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import cors from 'cors';

import {Client} from 'pg';
import {DataSource} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {migrate} from 'postgres-migrations';

import {parse} from 'yaml';
import {validate} from 'class-validator';

import nodemailer from 'nodemailer';

import {getInteger, getString, has} from '../util';

import Admin from './models/admin';
import SmtpConfig from './lib/smtpConfig';

import webpackConfig from '../../webpack.config.app';

import type RouteContext from './lib/routeContext';

import {postRegister} from './routes';
import createRegisterRoute from './api/register';

// Add classes used by typeorm as models here
// so that typeorm can extract the metadata from them.
const entities = [Admin];

const env = process.env.NODE_ENV;

if (env !== 'production' && env !== 'development') {
	throw new Error('NODE_ENV must be set to "production" or "development"');
}

const start = async () => {
	const configJson = await readFile(join(__dirname, '..', '..', 'config.yaml'), 'utf-8');
	const config = parse(configJson) as unknown;

	const dockerComposeJson = await readFile(join(__dirname, '..', '..', 'docker-compose.yaml'), 'utf-8');
	const dockerComposeConfig = parse(dockerComposeJson) as unknown;

	if (!config || typeof config !== 'object') {
		throw new Error('Invalid config.yml');
	}

	if (!has('smtp')(config)) {
		throw new Error('Missing smtp config in config.yml');
	}

	const smtpConfig = new SmtpConfig();
	Object.assign(smtpConfig, config.smtp);

	const smtpConfigErrors = await validate(smtpConfig);

	if (smtpConfigErrors.length > 0) {
		console.error('Invalid smtp config in config.yml', smtpConfigErrors);
		process.exit(1);
	}

	const mailer = nodemailer.createTransport(smtpConfig);

	console.log('Mailer created:', mailer.transporter.name);

	if (!dockerComposeConfig || typeof dockerComposeConfig !== 'object') {
		throw new Error('Invalid docker-compose.yaml');
	}

	const portKey = `${env}-server-port`;

	const port = getInteger([portKey])(config);
	const dbPortString = getString(['services', `${env}-db`, 'ports', '0'])(dockerComposeConfig);
	const [dbPort] = dbPortString.split(':');

	if (!dbPort || !Number.isInteger(Number(dbPort))) {
		throw new Error(`Invalid db port: ${dbPort}`);
	}

	const dbConfigPath = ['services', `${env}-db`, 'environment'];
	const dbHost = env === 'development' ? 'localhost' : `${env}-db`;
	const dbUser = getString([...dbConfigPath, 'POSTGRES_USER'])(dockerComposeConfig);
	const dbPassword = getString([...dbConfigPath, 'POSTGRES_PASSWORD'])(dockerComposeConfig);
	const dbDatabase = getString([...dbConfigPath, 'POSTGRES_DB'])(dockerComposeConfig);

	const dbConfig = {
		host: dbHost,
		port: Number(dbPort),
		user: dbUser,
		password: dbPassword,
		database: dbDatabase,
	};

	const pgClient = new Client(dbConfig);

	try {
		await pgClient.connect();
	} catch (err) {
		console.error(
			'Error connecting to the database with config',
			dbConfig,
			':',
			err,
			'is the db server running?',
		);
		process.exit(1);
	}

	try {
		const migrated = await migrate({client: pgClient}, join(__dirname, 'migrations'));
		console.log('Successfully ran migrations:', migrated);
	} catch (err) {
		console.error('Error running migrations:', err);
		process.exit(1);
	}

	await pgClient.end();

	const ds = new DataSource({
		type: 'postgres',
		...dbConfig,
		username: dbUser,
		synchronize: false,
		entities,
		namingStrategy: new SnakeNamingStrategy(),
	});

	try {
		await ds.initialize();
	} catch (err) {
		console.error('Error initializing data source:', err);
		process.exit(1);
	}

	console.log('Successfully initialized data source');

	const routeContext: RouteContext = {
		dataSource: ds,
		mailer,
		mailerFrom: smtpConfig.auth.user,
	};

	const app = express();

	if (env === 'development') {
		const compiler = webpack(webpackConfig);

		if (!webpackConfig.output) {
			throw new Error('Invalid webpack config, missing output path');
		}

		app.use(webpackDevMiddleware(compiler));
		app.use(webpackHotMiddleware(compiler));
	}

	app.use(bodyParser.json());
	app.use(express.static(join(__dirname, 'public')));
	app.use(cors());

	app.use((req, res, next) => {
		console.log('Request:', req.method, req.url);
		if (req.headers.accept?.startsWith('text/html')) {
			res.sendFile(join(__dirname, 'public', 'index.html'));
			return;
		}

		next();
	});

	app.post(postRegister, createRegisterRoute(routeContext));

	app.listen(port, '0.0.0.0', () => {
		console.log(`Server in "${env}" mode listening on port ${port}`);
	});
};

start().catch(err => {
	console.error(err);
	process.exit(1);
});
