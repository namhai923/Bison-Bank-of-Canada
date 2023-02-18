// assets
import { IconWallet, IconHistory } from '@tabler/icons';

// constant
const icons = { IconWallet, IconHistory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const transfer = {
    id: 'transfer',
    title: 'Transfer Money',
    type: 'group',
    children: [
        {
            id: 'transfer',
            title: 'Transfer',
            type: 'item',
            url: '/dashboard/transfer-money',
            icon: icons.IconWallet,
            breadcrumbs: false
        },
        {
            id: 'transfer-history',
            title: 'Transfer History',
            type: 'item',
            url: '/dashboard/transfer-history',
            icon: icons.IconHistory,
            breadcrumbs: false
        }
    ]
};

export default transfer;
