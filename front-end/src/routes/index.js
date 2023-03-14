import { useRoutes } from 'react-router-dom';

// routes
import BankingRoutes from './BankingRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([BankingRoutes, AuthenticationRoutes]);
}
