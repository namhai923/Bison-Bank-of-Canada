import React, { useState, useEffect } from 'react';

// import bbcApi from '../../../../api/bbcApi.js';

const WelcomeMessage = () => {
    let [name, setName] = useState('Bison');

    // console.log(name);
    // }, []);
    //     setName(user.firstName);
    //     let user = await bbcApi.getUser('elonmusk@twitter.com');
    // useEffect(async () => {
    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {name}!</h1>;
};

export default WelcomeMessage;
