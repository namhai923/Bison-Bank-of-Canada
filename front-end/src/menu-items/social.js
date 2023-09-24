// assets
import { IconUsers, IconMessage2 } from '@tabler/icons';

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const social = {
    id: 'social',
    title: 'Social',
    type: 'group',
    children: [
        {
            id: 'contacts',
            title: 'Contacts',
            type: 'item',
            icon: IconUsers,
            url: '/contacts'
        },
        {
            id: 'messenger',
            title: 'Messenger',
            type: 'item',
            icon: IconMessage2,
            url: '/messenger'
        }
    ]
};

export default social;
