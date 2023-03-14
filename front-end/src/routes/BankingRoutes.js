import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/banking/dashboard')));
const TransferHistory = Loadable(lazy(() => import('views/banking/TransferMoney/TransferHistory')));
const TransferMoney = Loadable(lazy(() => import('views/banking/TransferMoney/TransferMoney')));

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
            element: <TransferMoney />
        },
        {
            path: '/expense',
            element: <Dashboard />
        },
        {
            path: '/transfer',
            element: <TransferHistory />
        }
    ]
};

export default MainRoutes;
