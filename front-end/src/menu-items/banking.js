// assets
import { IconDashboard, IconWallet, IconHistory } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconWallet, IconHistory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const banking = {
    id: 'baking',
    title: 'Banking',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/',
            icon: icons.IconDashboard
        },
        {
            id: 'spend',
            title: 'Spend money',
            type: 'item',
            url: '/spend',
            icon: icons.IconWallet
        },
        {
            id: 'history',
            title: 'History',
            type: 'collapse',
            icon: icons.IconHistory,
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

export default banking;
