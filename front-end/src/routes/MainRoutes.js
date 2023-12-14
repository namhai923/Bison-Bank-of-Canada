import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/loader/Loadable';
import PrivateRoute from './PrivateRoute';

const Overview = Loadable(lazy(() => import('views/dashboard/overview')));
const Profile = Loadable(lazy(() => import('views/profile')));
const Favor = Loadable(lazy(() => import('views/dashboard/credit/favor')));
const Debt = Loadable(lazy(() => import('views/dashboard/credit/debt')));
const Repay = Loadable(lazy(() => import('views/dashboard/repay')));
const Contacts = Loadable(lazy(() => import('views/social/contacts')));
const Messenger = Loadable(lazy(() => import('views/social/messenger')));
const Pokegene = Loadable(lazy(() => import('views/spend/pokegene')));

const MainRoutes = {
    path: '/',
    element: <PrivateRoute />,
    children: [
        {
            path: '/',
            element: <MainLayout />,
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
                    path: 'credit',
                    children: [
                        {
                            path: 'favor',
                            element: <Favor />
                        },
                        {
                            path: 'debt',
                            element: <Debt />
                        }
                    ]
                },
                {
                    path: 'repay',
                    element: <Repay />
                },
                {
                    path: 'contacts',
                    element: <Contacts />
                },
                {
                    path: 'messenger',
                    element: <Messenger />
                },
                {
                    path: 'pokegene',
                    element: <Pokegene />
                }
            ]
        }
    ]
};

export default MainRoutes;
