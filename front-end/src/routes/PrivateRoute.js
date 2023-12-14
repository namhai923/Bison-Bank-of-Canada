import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useRefreshMutation } from 'app/features/auth/authApiSlice';
import usePersistLogin from 'utils/usePersistLogin';
import Loader from 'components/loader/Loader';

let PrivateRoute = () => {
    const [persistLogin] = usePersistLogin();
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();
    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();
    const [trueSuccess, setTrueSuccess] = useState(false);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token');
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.log(err);
                }
            };

            if (!token && persistLogin) verifyRefreshToken();
        }
        return () => (effectRan.current = true);

        // eslint-disable-next-line
    }, []);

    let content;
    if (!persistLogin) {
        if (token) {
            content = <Outlet />;
        } else {
            content = <Navigate to="/login" replace state={{ from: location }} />;
        }
    } else if (isLoading) {
        content = <Loader />;
    } else if (isError) {
        console.log(error?.data?.message);
        content = <Navigate to="/login" replace state={{ from: location }} />;
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />;
    } else if (token && isUninitialized) {
        content = <Outlet />;
    }
    return content;
};

PrivateRoute.propTypes = {
    children: PropTypes.element
};
export default PrivateRoute;
