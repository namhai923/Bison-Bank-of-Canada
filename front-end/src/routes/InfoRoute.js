import { lazy } from 'react';

// project imports
import Loadable from 'components/loader/Loadable';

const InfoPage = Loadable(lazy(() => import('views/info')));

const InfoRoute = {
    path: '/info',
    element: <InfoPage />
};

export default InfoRoute;
