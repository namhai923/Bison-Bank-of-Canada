import { shallowEqual, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const WelcomeMessage = () => {
    let [firstName, setFirstName] = useState('Bison');
    let user = useSelector((state) => state.user, shallowEqual);
    useEffect(() => {
        if (user.firstName !== '') {
            setFirstName(user.firstName);
        }
    }, user);

    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {firstName}!</h1>;
};

export default WelcomeMessage;
