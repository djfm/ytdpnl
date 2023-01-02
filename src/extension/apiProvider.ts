import React from 'react';

import {createApi, type Api} from './api';

import {has} from '../util';
import config from '../../config.extension';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

if (!has(`${env}-server-url`)(config)) {
	throw new Error(`Missing ${env}-server-url in config.extension.ts`);
}

const serverUrl = config[`${env}-server-url`];

export const defaultApi = createApi(serverUrl);

export const apiContext = React.createContext<Api>(defaultApi);

export const apiProvider = apiContext.Provider;

export const useApi = (): Api => React.useContext(apiContext);

export default apiProvider;
