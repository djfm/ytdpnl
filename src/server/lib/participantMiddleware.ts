import type express from 'express';

import {type Logger} from './logger';

export const createParticipantMiddleWare = (log: Logger) =>
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		const participantCode = req.headers['x-participant-code'];

		log('Checking participant code:', participantCode);

		if (typeof participantCode !== 'string') {
			res.status(401).json({kind: 'Failure', message: 'Invalid participant code header', code: 'NOT_AUTHENTICATED'});
			return;
		}

		if (!participantCode) {
			res.status(401).json({kind: 'Failure', message: 'Missing participant code header', code: 'NOT_AUTHENTICATED'});
			return;
		}

		log('Participant code:', participantCode);

		const sessionUuid = req.headers['x-session-uuid'];

		if (sessionUuid && typeof sessionUuid === 'string') {
			log('Session UUID:', sessionUuid);
			req.sessionUuid = sessionUuid;
		}

		req.participantCode = participantCode;

		next();
	};

export default createParticipantMiddleWare;
