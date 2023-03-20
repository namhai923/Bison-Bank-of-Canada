import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

//project import
import bbcApi from 'api/bbcApi';
import { setUser } from 'store/userSlice';

const App = () => {
    const customization = useSelector((state) => state.customization);
    let userInfo = useSelector((state) => state.user);
    let dispatch = useDispatch();

    useEffect(() => {
        let updateUser = async () => {
            try {
                let user = await bbcApi.getUser(userInfo.userName);
                let action = setUser(user);
                dispatch(action);
            } catch (error) {
                console.log(error);
            }
        };
        updateUser();
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
