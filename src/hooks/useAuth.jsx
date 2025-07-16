import React, { use } from 'react';
import { AuthContext } from '../context/AuthContext';
// import { AuthContext } from '../contexts/AuthContext/AuthContext';

const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;