import React from 'react';

import {Navigate, useLocation} from 'react-router-dom';

import {useAdmin} from '../AdminContext';

export const RequireAuthC: React.FC<{
	children?: React.ReactNode;
}> = ({children}) => {
	const admin = useAdmin();
	const location = useLocation();

	if (!admin) {
		return <Navigate to='/login' state={{from: location}} replace />;
	}

	return <>{children}</>;
};

export default RequireAuthC;
