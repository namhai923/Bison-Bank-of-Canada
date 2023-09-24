import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

const PageNotFound = Loadable(lazy(() => import('views/PageNotFound')));

const NotFoundRoute = {
    path: '/page-not-found',
    element: <PageNotFound />
};

export default NotFoundRoute;
