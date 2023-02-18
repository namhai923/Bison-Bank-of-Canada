import { useSelector } from 'react-redux';

const WelcomeMessage = () => {
    let user = useSelector((state) => state.user);
    console.log(user);

    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {user.firstName}!</h1>;
};

export default WelcomeMessage;
