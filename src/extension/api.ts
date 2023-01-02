import {type Maybe, makeApiVerbCreator} from '../util';
import {type Session} from '../server/models/session';

import {
	postCreateSession,
	postCheckParticipantCode,
} from '../server/routes';

export type Api = {
	createSession: (participantCode: string) => Promise<Maybe<Session>>;
	checkParticipantCode: (participantCode: string) => Promise<boolean>;
	setAuth: (participantCode: string) => void;
};

export const createApi = (serverUrl: string): Api => {
	let participantCode = '';

	const verb = makeApiVerbCreator(serverUrl, {
		'Content-Type': 'application/json',
		'X-Participant-Code': participantCode,
	});

	const post = verb('POST');

	return {
		async createSession() {
			return post<Session>(postCreateSession, {});
		},

		async checkParticipantCode(code: string) {
			const result = await post<boolean>(postCheckParticipantCode, {code});
			return result.kind === 'Success';
		},

		setAuth(code: string) {
			participantCode = code;
		},
	};
};
