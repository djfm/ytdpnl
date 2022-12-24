import React, {useContext} from 'react';

import type Admin from '../server/models/admin';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AdminContext = React.createContext<Admin | undefined>(undefined);

AdminContext.displayName = 'AdminContext';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AdminProvider = AdminContext.Provider;

export const useAdmin = (): Admin | undefined => useContext(AdminContext);

export default AdminContext;
