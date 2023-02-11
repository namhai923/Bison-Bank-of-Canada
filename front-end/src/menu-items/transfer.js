// assets
import { IconTransferIn } from '@tabler/icons';

// constant
const icons = { IconTransferIn };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const transfer = {
    id: '',
    title: 'Transfer Money',
    type: 'group',
    children: [
        {
            id: 'transfer',
            title: 'Transfer',
            type: 'item',
            url: '/dashboard/transfer-money',
            icon: icons.IconTransferIn,
            breadcrumbs: false
        },
        {
            id: 'transfer-history',
            title: 'Transfer History',
            type: 'item',
            url: '/dashboard/transfer-history',
            icon: icons.IconTransferIn,
            breadcrumbs: false
        }
    ]
};

export default transfer;
