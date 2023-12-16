import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useTheme, styled } from '@mui/material/styles';
import {
    Avatar,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { IconUser, IconTrash } from '@tabler/icons-react';
import moment from 'moment/moment';

import alphabetAvatar from 'assets/images/alphabetAvatar';
import { useDeleteNotificationMutation } from 'app/features/notification/notificationApiSlice';
import { openMenu } from 'app/features/customize/customizeSlice';
import longTextDisplay from 'utils/longTextDisplay';

let notificationType = {
    'favor:request': { message: 'Send you a favor request', url: '/credit/debt', menuId: 'debt' },
    'repay:request': { message: 'Send you a repay request', url: '/repay', menuId: 'repay' },
    'favor:accept': { message: 'Accept your favor request', url: '/credit/favor', menuId: 'favor' },
    'repay:accept': { message: 'Accept your repay request', url: '/repay', menuId: 'repay' },
    'favor:decline': { message: 'Decline your favor request', url: '/credit/favor', menuId: 'favor' },
    'repay:decline': { message: 'Decline your repay request', url: '/repay', menuId: 'repay' },
    'pokemon:send': { message: 'Send you a pokemon', url: 'pokegene', menuId: 'pokegene' },
    'contact:add': { message: 'Add your account to their contact', url: '' }
};

const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

const NotificationList = (props) => {
    const theme = useTheme();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let { notificationList, handleMarkRead } = props;

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.warning.light
    };

    let [deleteNotification] = useDeleteNotificationMutation();
    let handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {notificationList.length === 0 ? (
                <Paper
                    sx={{
                        textAlign: 'center',
                        py: 3,
                        px: 3
                    }}
                >
                    <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                        You have no notification!
                    </Typography>
                </Paper>
            ) : (
                <List
                    sx={{
                        minWidth: 330,
                        py: 0,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                            maxWidth: 300
                        },
                        '& .MuiListItemSecondaryAction-root': {
                            top: 22
                        },
                        '& .MuiDivider-root': {
                            my: 0
                        },
                        '& .list-container': {
                            pl: 7
                        }
                    }}
                >
                    {notificationList.map((notification) => {
                        let { userName, type, read, createdAt, notificationId } = notification;
                        return (
                            <>
                                <ListItemWrapper
                                    key={notificationId}
                                    onClick={() => {
                                        if (notificationType[type].url !== '') {
                                            navigate(notificationType[type].url);
                                            dispatch(openMenu(notificationType[type].menuId));
                                        }
                                        if (!read) {
                                            handleMarkRead(notificationId);
                                        }
                                    }}
                                >
                                    <ListItem alignItems="center">
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={userName}
                                                src={userName === '' ? IconUser : alphabetAvatar[`${userName.toLowerCase()[0]}`]}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={longTextDisplay(userName, 22)} />
                                        <ListItemSecondaryAction>
                                            <Grid container justifyContent="flex-end">
                                                <Grid item xs={12}>
                                                    <Tooltip title="Delete notification">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                handleDeleteNotification(notificationId);
                                                            }}
                                                        >
                                                            <IconTrash stroke={1.5} size="1.3rem" color={theme.palette.error.dark} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Grid container direction="column" className="list-container">
                                        <Grid item xs={12} sx={{ pb: 2 }}>
                                            <Typography variant="subtitle2">{notificationType[type].message}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="space-between">
                                                <Grid item>
                                                    <Typography variant="caption">{moment(createdAt).fromNow()}</Typography>
                                                </Grid>
                                                {!read && (
                                                    <Grid item>
                                                        <Chip label="Unread" sx={chipWarningSX} />
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </ListItemWrapper>
                                <Divider />
                            </>
                        );
                    })}
                </List>
            )}
        </>
    );
};

NotificationList.propTypes = {
    notificationList: PropTypes.arrayOf(PropTypes.object),
    handleMarkRead: PropTypes.func
};

export default NotificationList;
