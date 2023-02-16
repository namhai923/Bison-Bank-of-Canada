import React, { useState, useEffect } from 'react';

import bbcApi from '../../../../api/bbcApi.js';

const WelcomeMessage = () => {
    let [name, setName] = useState('Bison');

    useEffect(() => {
        async function getUser() {
            let user = await bbcApi.getUser('elonmusk@twitter.com');
            setName(user.firstName);
            console.log(user);
        }
        getUser();
    }, []);
    console.log('asd' + bbcApi.getUser('elonmusk@twitter.com'));
    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {name}!</h1>;
};

export default WelcomeMessage;
