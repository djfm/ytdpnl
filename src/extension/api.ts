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
	getSession: () => string | undefined;
	ensureSession: () => Promise<void>;
	getConfig: () => Promise<Maybe<ParticipantConfig>>;
	postEvent: (event: Event) => Promise<boolean>;
	logout(): void;
};

const cache = memoizeTemporarily(1000);

export const createApi = (serverUrl: string): Api => {
	let participantCode = localStorage.getItem('participantCode') ?? '';
	let sessionUuid = sessionStorage.getItem('sessionUuid') ?? '';
	let sessionPromise: Promise<Maybe<Session>> | undefined;

	const headers = () => ({
		'Content-Type': 'application/json',
		'X-Participant-Code': participantCode,
		'X-Session-UUID': sessionUuid,
	});

	const verb = makeApiVerbCreator(serverUrl);

	const post = verb('POST');
	const get = verb('GET');

	const getConfigCached = cache(async () => get<ParticipantConfig>(getParticipantConfig, {}, headers()));

	return {
		async createSession() {
			if (sessionPromise) {
				return sessionPromise;
			}

			const p = post<Session>(postCreateSession, {}, headers());
			sessionPromise = p;

			p.then(() => {
				sessionPromise = undefined;
			}).catch(console.error);

			return p;
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

			console.log('Creating new session');

			const res = await this.createSession();

			if (res.kind === 'Success') {
				sessionUuid = res.value.uuid;
				sessionStorage.setItem('sessionUuid', sessionUuid);
				console.log('New session', sessionUuid);
				return true;
			}

			console.error('Failed to create session:', res.message);

			return false;
		},

		getSession() {
			return sessionUuid === '' ? undefined : sessionUuid;
		},

		async getConfig() {
			return getConfigCached(undefined);
		},

		async ensureSession() {
			if (sessionUuid !== '') {
				return;
			}

			if (sessionPromise) {
				await sessionPromise;
				return;
			}

			await this.newSession();
		},

		async postEvent(event: Event) {
			await this.ensureSession();

			event.sessionUuid = sessionUuid;

			const res = await post<boolean>(postEvent, event, headers());

			if (res.kind === 'Success') {
				return true;
			}

			console.error('Failed to post event:', res.message);

			return false;
		},

		logout() {
			localStorage.removeItem('participantCode');
			sessionStorage.removeItem('sessionUuid');
			participantCode = '';
			sessionUuid = '';
		},
	};
};
