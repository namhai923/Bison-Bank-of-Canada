import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import {
    Box,
    ButtonBase,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    ListItemButton,
    ListItemText,
    Link,
    useMediaQuery,
    Badge
} from '@mui/material';
import { IconBell } from '@tabler/icons-react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import NotificationList from './NotificationList';
import { AvatarStyle } from 'components/styled-input';
import { setValue } from 'app/features/value/valueSlice';
import { useGetNotificationListQuery, useMarkReadNotificationMutation } from 'app/features/notification/notificationApiSlice';
import config from 'assets/data/config';

const status = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'unread',
        label: 'Unread'
    }
];

const NotificationSection = () => {
    let notification = useSelector((state) => state.value.notification);
    let customization = useSelector((state) => state.customization);
    let dispatch = useDispatch();
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    let {
        data: notificationList,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetNotificationListQuery('nofiticationList', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    let handleNotificationClick = (notiValue) => {
        let action = setValue({ type: 'notification', value: notiValue });
        dispatch(action);
    };

    let [markReadNotification] = useMarkReadNotificationMutation();
    let handleMarkRead = async (notificationId) => {
        try {
            await markReadNotification(notificationId);
        } catch (err) {
            console.log(err);
        }
    };

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        let unRead = notificationList.filter((notification) => !notification.read).length;

        let displayNotification;
        if (notification === 'unread') {
            displayNotification = notificationList.filter((notification) => !notification.read);
        } else {
            displayNotification = notificationList;
        }
        content = (
            <>
                <Box
                    sx={{
                        ml: 2,
                        mr: 3,
                        [theme.breakpoints.down('md')]: {
                            mr: 2
                        }
                    }}
                >
                    <Badge color="warning" badgeContent={unRead}>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <AvatarStyle
                                variant="rounded"
                                color={theme.palette.secondary}
                                sx={{
                                    '&[aria-controls="menu-list-grow"]': {
                                        background: theme.palette.secondary.dark,
                                        color: theme.palette.secondary.light
                                    }
                                }}
                                ref={anchorRef}
                                aria-controls={open ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                            >
                                <IconBell stroke={1.5} size="1.3rem" />
                            </AvatarStyle>
                        </ButtonBase>
                    </Badge>
                </Box>
                <Popper
                    placement={matchesXs ? 'bottom' : 'bottom-end'}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    popperOptions={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [matchesXs ? 5 : 0, 20]
                                }
                            }
                        ]
                    }}
                >
                    {({ TransitionProps }) => (
                        <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Grid container direction="column">
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>
                                                        <Typography variant="h3">Notifications</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Link component="button" variant="subtitle2" onClick={() => handleMarkRead('all')}>
                                                            Mark all as read
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sx={{ pt: 2 }}>
                                                <Grid container direction="column" spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Grid container sx={{ px: 2 }}>
                                                            <Stack direction="row" spacing={1}>
                                                                {status.map((option) => {
                                                                    let selected = option.value === notification;
                                                                    return (
                                                                        <ListItemButton
                                                                            sx={{
                                                                                borderRadius: `${customization.borderRadius}px`,
                                                                                pt: 1,
                                                                                pb: 1
                                                                            }}
                                                                            selected={selected}
                                                                            onClick={() => handleNotificationClick(option.value)}
                                                                        >
                                                                            <ListItemText
                                                                                primary={
                                                                                    <Typography
                                                                                        variant={selected ? 'h5' : 'body1'}
                                                                                        color="inherit"
                                                                                    >
                                                                                        {option.label}
                                                                                    </Typography>
                                                                                }
                                                                            />
                                                                        </ListItemButton>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} p={0}>
                                                        <Divider sx={{ my: 0 }} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <PerfectScrollbar
                                                    style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                                >
                                                    <NotificationList
                                                        notificationList={displayNotification}
                                                        handleMarkRead={handleMarkRead}
                                                    />
                                                </PerfectScrollbar>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        </Transitions>
                    )}
                </Popper>
            </>
        );
    }
    return content;
};

export default NotificationSection;
