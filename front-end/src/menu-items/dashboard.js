import { IconDashboard, IconStar, IconReceiptRefund } from '@tabler/icons-react';

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
            id: 'credit',
            title: 'Credit',
            type: 'collapse',
            icon: IconStar,
            children: [
                {
                    id: 'favor',
                    title: 'Favor',
                    type: 'item',
                    url: '/credit/favor'
                },
                {
                    id: 'debt',
                    title: 'Debt',
                    type: 'item',
                    url: '/credit/debt'
                }
            ]
        },
        {
            id: 'repay',
            title: 'Repay',
            type: 'item',
            url: '/repay',
            icon: IconReceiptRefund
        }
    ]
};

export default dashboard;
