import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/auth-template/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/auth-template/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/user/login',
            element: <AuthLogin />
        },
        {
            path: '/user/register',
            element: <AuthRegister />
        }
    ]
};

export default AuthenticationRoutes;
