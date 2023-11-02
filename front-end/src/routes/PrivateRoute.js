import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useRefreshMutation } from 'app/features/auth/authApiSlice';
import usePersistLogin from 'utils/usePersistLogin';
import Loader from 'components/loader/Loader';

let PrivateRoute = ({ children }) => {
    const [persistLogin] = usePersistLogin();
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();
    const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();
    const [trueSuccess, setTrueSuccess] = useState(false);
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) {
            const verifyRefreshToken = async () => {
                try {
                    console.log('verifying refresh token');
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.log(err);
                }
            };

            if (!token && persistLogin) verifyRefreshToken();
        }
        return () => (effectRan.current = true);
    }, []);

    let content;
    if (!persistLogin) {
        if (token) {
            content = children;
        } else {
            content = <Navigate to="/login" replace state={{ from: location }} />;
        }
    } else if (isLoading) {
        content = <Loader />;
    } else if (isError) {
        console.log(error?.data?.message);
        content = <Navigate to="/login" replace state={{ from: location }} />;
    } else if (isSuccess && trueSuccess) {
        content = children;
    } else if (token && isUninitialized) {
        content = children;
    }
    return content;
};

PrivateRoute.propTypes = {
    children: PropTypes.element
};
export default PrivateRoute;
