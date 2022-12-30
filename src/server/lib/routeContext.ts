import {type DataSource} from 'typeorm';
import {type Transporter} from 'nodemailer';
import {type Request, type Response} from 'express';

import {type Logger} from './logger';

export type RouteContext = {
	dataSource: DataSource;
	mailer: Transporter;
	mailerFrom: string;
	log: Logger;
};

export type RouteCreator = (context: RouteContext) => (req: Request, res: Response) => Promise<void>;

export default RouteContext;
