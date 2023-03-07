import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/auth-template/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/auth-template/Register')));
const AuthTransferMoney = Loadable(lazy(() => import('views/pages/authentication/auth-template/TransferMoney')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    children: [
        {
            path: '/user/login',
            element: <AuthLogin />
        },
        {
            path: '/user/register',
            element: <AuthRegister />
        },
        {
            path: '/dashboard/transfer-money',
            element: <AuthTransferMoney />
        }
    ]
};

export default AuthenticationRoutes;
