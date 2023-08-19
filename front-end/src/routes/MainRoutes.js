import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import PrivateRoute from './PrivateRoute';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/banking/dashboard')));
const Profile = Loadable(lazy(() => import('views/profile')));
const ExpenseHistory = Loadable(lazy(() => import('views/banking/history/ExpenseHistory')));
const TransferHistory = Loadable(lazy(() => import('views/banking/history/TransferHistory')));
const SpendMoney = Loadable(lazy(() => import('views/banking/spend-money')));

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
            path: '/',
            element: <Dashboard />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: 'spend',
            element: <SpendMoney />
        },
        {
            path: 'history',
            children: [
                {
                    path: 'expense',
                    element: <ExpenseHistory />
                },
                {
                    path: 'transfer',
                    element: <TransferHistory />
                }
            ]
        }
    ]
};

export default MainRoutes;
