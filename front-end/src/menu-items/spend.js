import { IconPokeball } from '@tabler/icons-react';

const spend = {
    id: 'spend',
    title: 'Spend',
    type: 'group',
    children: [
        {
            id: 'pokegene',
            title: 'Pokegene',
            type: 'item',
            icon: IconPokeball,
            url: '/pokegene'
        }
    ]
};

export default spend;
