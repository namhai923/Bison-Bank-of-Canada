import { useRoutes, Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import InfoRoute from './InfoRoute';
import NotFoundRoute from './NotFoundRoute';

export default function Routes() {
    return useRoutes([
        MainRoutes,
        AuthenticationRoutes,
        InfoRoute,
        NotFoundRoute,
        {
            path: '*',
            element: <Navigate to="/page-not-found" replace />
        }
    ]);
}
