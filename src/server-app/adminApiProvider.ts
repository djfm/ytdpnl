import React from 'react';

import {createAdminApi, type AdminApi} from './adminApi';

import {has} from '../util';
import config from '../../config.extension';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

if (!has(`${env}-server-url`)(config)) {
	throw new Error(`Missing ${env}-server-url in config.extension.ts`);
}

const serverUrl = config[`${env}-server-url`];

export const defaultAdminApi = createAdminApi(serverUrl);

export const adminApiContext = React.createContext<AdminApi>(defaultAdminApi);

export const adminApiProvider = adminApiContext.Provider;

export const useAdminApi = (): AdminApi => React.useContext(adminApiContext);

export default adminApiProvider;
