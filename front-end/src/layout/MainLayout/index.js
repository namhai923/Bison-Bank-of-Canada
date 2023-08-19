import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import jwtDecode from 'jwt-decode';

import Header from './Header';
import Sidebar from './Sidebar';
import { drawerWidth } from 'assets/data/constant';
import { setMenu } from 'app/features/customize/customizeSlice';

import { userApiSlice } from 'app/features/user/userApiSlice';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    let token = useSelector((state) => state.auth.token);

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        let action = setMenu(!leftDrawerOpened);
        dispatch(action);
    };

    const effectRan = useRef(false);
    useEffect(() => {
        if (effectRan.current === true) {
            dispatch(userApiSlice.util.prefetch('getUserInfo', jwtDecode(token).userName, { force: true }));
            dispatch(userApiSlice.util.prefetch('getBalance', jwtDecode(token).userName, { force: true }));
            dispatch(userApiSlice.util.prefetch('getExpense', jwtDecode(token).userName, { force: true }));
            dispatch(userApiSlice.util.prefetch('getTransfer', jwtDecode(token).userName, { force: true }));
        }
        return () => (effectRan.current = true);
    }, [token, dispatch]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            {/* drawer */}
            <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

            {/* main content */}
            <Main theme={theme} open={leftDrawerOpened}>
                <Outlet />
            </Main>
        </Box>
    );
};

export default MainLayout;
