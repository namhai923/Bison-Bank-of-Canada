import React, { useState, useEffect } from 'react';

import bbcApi from '../../../../api/bbcApi.js';

const WelcomeMessage = () => {
    let [name, setName] = useState('Bison');

    useEffect(async () => {
        let user = await bbcApi.getUser('elonmusk@twitter.com');
        setName(user.firstName);
    }, []);
    console.log(name);
    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {name}!</h1>;
};

export default WelcomeMessage;
