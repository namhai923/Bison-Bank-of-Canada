import { shallowEqual, useSelector } from 'react-redux';

const WelcomeMessage = () => {
    let userInfo = useSelector((state) => state.user, shallowEqual);

    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {userInfo.firstName}!</h1>;
};

export default WelcomeMessage;
