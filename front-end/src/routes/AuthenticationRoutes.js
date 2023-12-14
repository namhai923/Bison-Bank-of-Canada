import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

import Loadable from 'components/loader/Loadable';

const Login = Loadable(lazy(() => import('views/authentication/Login')));
const Register = Loadable(lazy(() => import('views/authentication/Register')));

const AuthenticationRoutes = {
    path: '/',
    element: <Outlet />,
    children: [
        {
            path: 'login',
            element: <Login />
        },
        {
            path: 'register',
            element: <Register />
        }
    ]
};

export default AuthenticationRoutes;
