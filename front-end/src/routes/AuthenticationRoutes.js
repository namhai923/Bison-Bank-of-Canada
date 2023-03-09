import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/authentication/auth-template/Login')));
const AuthRegister = Loadable(lazy(() => import('views/authentication/auth-template/Register')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        }
    ]
};

export default AuthenticationRoutes;
