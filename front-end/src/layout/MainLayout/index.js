import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import { drawerWidth } from 'assets/data/constant';
import { setMenu } from 'app/features/customize/customizeSlice';
import { userApiSlice } from 'app/features/user/userApiSlice';
import { favorApiSlice } from 'app/features/favor/favorApiSlice';
import { debtApiSlice } from 'app/features/debt/debtApiSlice';
import { repayApiSlice } from 'app/features/repay/repayApiSlice';
import { notificationApiSlice } from 'app/features/notification/notificationApiSlice';
import { contactApiSlice } from 'app/features/contact/contactApiSlice';
import { messengerApiSlice } from 'app/features/messenger/messengerApiSlice';
import { pokeApiSlice } from 'app/features/pokegene/pokeApiSlice';

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
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`
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
            dispatch(userApiSlice.util.prefetch('getUserInfo', 'userInfo', { force: true }));
            dispatch(favorApiSlice.util.prefetch('getFavorSummary', 'favorSummary', { force: true }));
            dispatch(favorApiSlice.util.prefetch('getFavorHistory', 'favorHistory', { force: true }));
            dispatch(favorApiSlice.util.prefetch('getPendingFavor', 'pendingFavor', { force: true }));
            dispatch(debtApiSlice.util.prefetch('getDebtSummary', 'debtSummary', { force: true }));
            dispatch(debtApiSlice.util.prefetch('getDebtHistory', 'debtHistory', { force: true }));
            dispatch(repayApiSlice.util.prefetch('getRepayHistory', 'repayHistory', { force: true }));
            dispatch(repayApiSlice.util.prefetch('getPendingRepay', 'pendingRepay', { force: true }));
            dispatch(contactApiSlice.util.prefetch('getContacts', 'contacts', { force: true }));
            dispatch(notificationApiSlice.util.prefetch('getNotificationList', 'notificationList', { force: true }));
            dispatch(messengerApiSlice.util.prefetch('getConversationsInfo', 'conversationsInfo', { force: true }));
            dispatch(pokeApiSlice.util.prefetch('getPokeCollection', 'pokeCollection', { force: true }));
        }
        return () => (effectRan.current = true);
    }, [dispatch]);

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
            <Main theme={theme} open={leftDrawerOpened} height="100%">
                <Outlet />
            </Main>
        </Box>
    );
};

export default MainLayout;
