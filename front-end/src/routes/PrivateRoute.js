import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

let PrivateRoute = ({ children }) => {
    let userInfo = localStorage.getItem('userInfo');
    let location = useLocation();
    return userInfo ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

PrivateRoute.propTypes = {
    children: PropTypes.element
};
export default PrivateRoute;
