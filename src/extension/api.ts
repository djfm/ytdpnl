import {type Maybe, makeApiVerbCreator} from '../util';
import {type Session} from '../server/models/session';

import {
	createSession,
} from '../server/routes';

export type Api = {
	createSession: (participantCode: string) => Promise<Maybe<Session>>;
};

export const createApi = (serverUrl: string, participantCode: string): Api => {
	const verb = makeApiVerbCreator(serverUrl, {
		'Content-Type': 'application/json',
		'X-Participant-Code': participantCode,
	});

	const post = verb('POST');

	return {
		async createSession() {
			return post<Session>(createSession, {});
		},
	};
};
