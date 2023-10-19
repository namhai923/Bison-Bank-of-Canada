import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import PrivateRoute from './PrivateRoute';

const Overview = Loadable(lazy(() => import('views/dashboard/overview')));
const Profile = Loadable(lazy(() => import('views/profile')));
const Favor = Loadable(lazy(() => import('views/dashboard/history/favor')));
const Debt = Loadable(lazy(() => import('views/dashboard/history/debt')));
const Repay = Loadable(lazy(() => import('views/dashboard/history/repay')));
const Contacts = Loadable(lazy(() => import('views/social/contacts')));
const Messenger = Loadable(lazy(() => import('views/social/messenger')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <PrivateRoute>
            <MainLayout />
        </PrivateRoute>
    ),
    children: [
        {
            path: '',
            element: <Overview />
        },
        {
            path: 'profile',
            element: <Profile />
        },
        {
            path: 'history',
            children: [
                {
                    path: 'favor',
                    element: <Favor />
                },
                {
                    path: 'debt',
                    element: <Debt />
                },
                {
                    path: 'repay',
                    element: <Repay />
                }
            ]
        },
        {
            path: 'contacts',
            element: <Contacts />
        },
        {
            path: 'messenger',
            element: <Messenger />
        }
    ]
};

export default MainRoutes;
