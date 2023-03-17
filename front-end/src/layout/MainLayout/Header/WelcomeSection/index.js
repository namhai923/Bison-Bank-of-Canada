import { useSelector } from 'react-redux';

const WelcomeMessage = () => {
    let userInfo = useSelector((state) => state.user);

    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {userInfo.firstName}!</h1>;
};

export default WelcomeMessage;
