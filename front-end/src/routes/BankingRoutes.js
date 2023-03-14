import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/banking/dashboard')));
const TransferHistory = Loadable(lazy(() => import('views/banking/history/TransferHistory')));
const ExpenseHistory = Loadable(lazy(() => import('views/banking/history/ExpenseHistory')));
const Transfer = Loadable(lazy(() => import('views/banking/send-money/Transfer')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Dashboard />
        },
        {
            path: '/send',
            element: <Transfer />
        },
        {
            path: '/expense',
            element: <ExpenseHistory />
        },
        {
            path: '/transfer',
            element: <TransferHistory />
        }
    ]
};

export default MainRoutes;
