import {type Maybe, makeApiVerbCreator} from '../util';
import {type Session} from '../server/models/session';

import {type ExperimentConfig} from './createRecommendationsList';

import {
	postCreateSession,
	postCheckParticipantCode,
	getParticipantConfig,
} from '../server/routes';

export type Api = {
	createSession: () => Promise<Maybe<Session>>;
	checkParticipantCode: (participantCode: string) => Promise<boolean>;
	setAuth: (participantCode: string) => void;
	newSession: () => Promise<boolean>;
	getSession: () => Session | undefined;
	getConfig: () => Promise<Maybe<ExperimentConfig>>;
};

export const createApi = (serverUrl: string): Api => {
	let participantCode = localStorage.getItem('participantCode') ?? '';
	let session: Session | undefined;

	const headers = () => ({
		'Content-Type': 'application/json',
		'X-Participant-Code': participantCode,
	});

	const verb = makeApiVerbCreator(serverUrl);

	const post = verb('POST');
	const get = verb('GET');

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
			return get<ExperimentConfig>(getParticipantConfig, {}, headers());
		},
	};
};
