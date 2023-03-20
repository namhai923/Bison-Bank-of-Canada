import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

const Login = Loadable(lazy(() => import('views/authentication/auth-template/Login')));
const Register = Loadable(lazy(() => import('views/authentication/auth-template/Register')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    children: [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        }
    ]
};

export default AuthenticationRoutes;
