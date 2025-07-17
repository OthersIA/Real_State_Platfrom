import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import LoadingFallback from '../components/shared/LoadingFallback';

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    // console.log(user);
    // console.log(isLoading);


    if (isLoading) {
        return <LoadingFallback />
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;