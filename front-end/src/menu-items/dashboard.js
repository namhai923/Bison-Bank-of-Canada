// assets
import { IconDashboard, IconHistory } from '@tabler/icons-react';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'overview',
            title: 'Overview',
            type: 'item',
            url: '/',
            icon: IconDashboard
        },
        {
            id: 'history',
            title: 'History',
            type: 'collapse',
            icon: IconHistory,
            children: [
                {
                    id: 'favor',
                    title: 'Favor',
                    type: 'item',
                    url: '/history/favor'
                },
                {
                    id: 'debt',
                    title: 'Debt',
                    type: 'item',
                    url: '/history/debt'
                },
                {
                    id: 'repay',
                    title: 'Repay',
                    type: 'item',
                    url: '/history/repay'
                }
            ]
        }
    ]
};

export default dashboard;
