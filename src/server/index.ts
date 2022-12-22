import {readFile} from 'fs/promises';
import {join} from 'path';

import express from 'express';
import {Client} from 'pg';
import type {ClientConfig} from 'pg';
import {parse} from 'yaml';

import {getInteger, getString} from '../util';

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

	const dbConfig: ClientConfig = {
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

	const app = express();

	app.listen(port, '0.0.0.0', () => {
		console.log(`Server in "${env}" mode listening on port ${port}`);
	});
};

start().catch(err => {
	console.error(err);
	process.exit(1);
});
