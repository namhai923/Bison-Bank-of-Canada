import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

// import bbcApi from '../../../../api/bbcApi.js';

const WelcomeMessage = () => {
    const location = useLocation();
    let [name, setName] = useState('Bison');
    useEffect(() => {
        async function getUser(email) {
            let user = await bbcApi.getUser(email);
            setName(user.firstName);
        }
        if (location.state == null) {
            getUser('elonmusk@twitter.com');
        } else {
            getUser(location.state.name);
        }
        getUser();
    }, []);
    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {name}!</h1>;
};

export default WelcomeMessage;
