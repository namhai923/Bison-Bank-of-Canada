import { IconUsers, IconMessages } from '@tabler/icons-react';

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
            icon: IconMessages,
            url: '/messenger'
        }
    ]
};

export default social;
