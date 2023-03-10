// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
    IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const auth = {
    id: 'authentication',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Authentication',
            type: 'collapse',
            icon: icons.IconKey,

            children: [
                {
                    id: 'login',
                    title: 'Login',
                    type: 'item',
                    url: '/user/login',
                    target: true
                },
                {
                    id: 'register',
                    title: 'Register',
                    type: 'item',
                    url: '/user/register',
                    target: true
                }
            ]
        }
    ]
};

export default auth;
