import {type DataSource} from 'typeorm';
import {type Transporter} from 'nodemailer';
import {type Request, type Response} from 'express';

import {type Logger} from './logger';
import {type TokenTools} from './crypto';

export type RouteContext = {
	dataSource: DataSource;
	mailer: Transporter;
	mailerFrom: string;
	log: Logger;
	tokenTools: TokenTools;
};

export type RouteCreator = (context: RouteContext) => (req: Request, res: Response) => Promise<void>;

export default RouteContext;
