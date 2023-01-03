import {type Maybe, makeApiVerbCreator, memoizeTemporarily} from '../util';
import type Session from '../server/models/session';
import type Event from '../server/models/event';
import {type ParticipantConfig} from '../server/api/participantConfig';

import {
	postCreateSession,
	postCheckParticipantCode,
	getParticipantConfig,
	postEvent,
} from '../server/routes';

export type Api = {
	createSession: () => Promise<Maybe<Session>>;
	checkParticipantCode: (participantCode: string) => Promise<boolean>;
	setAuth: (participantCode: string) => void;
	newSession: () => Promise<boolean>;
	getSession: () => Session | undefined;
	getConfig: () => Promise<Maybe<ParticipantConfig>>;
	postEvent: (event: Event) => Promise<boolean>;
};

const cache = memoizeTemporarily(1000);

export const createApi = (serverUrl: string): Api => {
	let participantCode = localStorage.getItem('participantCode') ?? '';
	let session: Session | undefined;

	const headers = () => ({
		'Content-Type': 'application/json',
		'X-Participant-Code': participantCode,
		'X-Session-UUID': session?.uuid ?? '',
	});

	const verb = makeApiVerbCreator(serverUrl);

	const post = verb('POST');
	const get = verb('GET');

	const getConfigCached = cache(async () => get<ParticipantConfig>(getParticipantConfig, {}, headers()));

	return {
		async createSession() {
			return post<Session>(postCreateSession, {}, headers());
		},

		async checkParticipantCode(code: string) {
			const result = await post<boolean>(postCheckParticipantCode, {code}, headers());

			if (result.kind !== 'Success') {
				return false;
			}

			return true;
		},

		setAuth(code: string) {
			localStorage.setItem('participantCode', code);
			participantCode = code;
		},

		async newSession() {
			if (!participantCode) {
				console.error('Missing participant code');
				return false;
			}

			const res = await this.createSession();

			if (res.kind === 'Success') {
				session = res.value;
				console.log('New session', session.uuid);
				return true;
			}

			console.error('Failed to create session:', res.message);

			return false;
		},

		getSession() {
			return session;
		},

		async getConfig() {
			return getConfigCached(undefined);
		},

		async postEvent(event: Event) {
			if (session === undefined) {
				console.log('Creating session before posting event');
				await this.newSession();
			}

			event.sessionUuid = session?.uuid ?? '';

			const res = await post<boolean>(postEvent, event, headers());

			if (res.kind === 'Success') {
				return true;
			}

			console.error('Failed to post event:', res.message);

			return false;
		},
	};
};
