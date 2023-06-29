import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

//project imports
import bbcApi from 'api/bbcApi';
import { setUser } from 'store/userSlice';
import socket from 'socket';

const App = () => {
    const customization = useSelector((state) => state.customization);
    let userInfo = useSelector((state) => state.user);
    let dispatch = useDispatch();

    // const socket = useRef();

    useEffect(() => {
        let updateUser = async () => {
            try {
                let user = await bbcApi.getUser({ userName: userInfo.userName });
                let action = setUser(user);
                dispatch(action);
            } catch (error) {
                console.log(error);
            }
        };
        updateUser();
    }, []);

    useEffect(() => {
        // socket.current = io(process.env.REACT_APP_SOCKET);
        socket.on('getTransfer', (data) => {
            console.log(`${data.senderId} send ${data.transfer}`);
        });
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <Routes />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
