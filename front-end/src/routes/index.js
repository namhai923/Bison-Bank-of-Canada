import { useRoutes, Navigate } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import NotFoundRoute from './NotFoundRoute';

export default function ThemeRoutes() {
    return useRoutes([
        MainRoutes,
        AuthenticationRoutes,
        NotFoundRoute,
        {
            path: '*',
            element: <Navigate to="/page-not-found" replace />
        }
    ]);
}
