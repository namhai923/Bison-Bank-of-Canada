import { useState, useEffect } from 'react';

const usePersistLogin = () => {
    const [persistLogin, setPersistLogin] = useState(JSON.parse(localStorage.getItem('persistLogin')) || false);

    useEffect(() => {
        localStorage.setItem('persistLogin', JSON.stringify(persistLogin));
    }, [persistLogin]);

    return [persistLogin, setPersistLogin];
};
export default usePersistLogin;
