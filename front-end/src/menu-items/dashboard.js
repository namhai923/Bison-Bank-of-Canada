// assets
import { IconDashboard, IconWallet, IconHistory } from '@tabler/icons';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'analytics',
            title: 'Analytics',
            type: 'item',
            url: '/',
            icon: IconDashboard
        },
        {
            id: 'spend',
            title: 'Spend money',
            type: 'item',
            url: '/spend',
            icon: IconWallet
        },
        {
            id: 'history',
            title: 'History',
            type: 'collapse',
            icon: IconHistory,
            children: [
                {
                    id: 'expense',
                    title: 'Expense',
                    type: 'item',
                    url: '/history/expense'
                },
                {
                    id: 'transfer',
                    title: 'Transfer',
                    type: 'item',
                    url: '/history/transfer'
                }
            ]
        }
    ]
};

export default dashboard;
