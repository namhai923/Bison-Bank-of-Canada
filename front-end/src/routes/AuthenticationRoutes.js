import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

const Login = Loadable(lazy(() => import('views/authentication/auth-template/Login')));
const Register = Loadable(lazy(() => import('views/authentication/auth-template/Register')));

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
