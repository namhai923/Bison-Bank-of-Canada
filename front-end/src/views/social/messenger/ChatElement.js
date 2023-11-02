import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Badge, Stack, Avatar, Typography, ListItemButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import moment from 'moment/moment';

import alphabetAvatar from 'assets/images/alphabetAvatar';
import { IconUser } from '@tabler/icons-react';
import { setValue } from 'app/features/value/valueSlice';

const truncateText = (string, n) => {
    return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledBadge = styled(Badge, { shouldForwardProp })(({ theme, active }) => {
    if (active) {
        return {
            '& .MuiBadge-badge': {
                backgroundColor: theme.palette.success.dark,
                color: theme.palette.success.dark,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: 'ripple 1.2s infinite ease-in-out',
                    border: '1px solid currentColor',
                    content: '""'
                }
            },
            '@keyframes ripple': {
                '0%': {
                    transform: 'scale(.8)',
                    opacity: 1
                },
                '100%': {
                    transform: 'scale(2.4)',
                    opacity: 0
                }
            }
        };
    } else {
        return {
            '& .MuiBadge-badge': {
                backgroundColor: theme.palette.error.dark,
                color: theme.palette.error.dark,
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: 'ripple 1.2s infinite ease-in-out',
                    border: '1px solid currentColor',
                    content: '""'
                }
            }
        };
    }
});

const ChatElement = (props) => {
    let { chatProps } = props;
    let { name, userName, latestMessage, unRead, active } = chatProps;

    let dispatch = useDispatch();

    let currentConversation = useSelector((state) => state.value.currentConversation);
    let isSelected = false;
    if (currentConversation) {
        isSelected = userName === currentConversation;
    }

    return (
        <ListItemButton
            sx={{ paddingTop: 2, paddingBottom: 2 }}
            onClick={() => {
                dispatch(setValue({ type: 'currentConversation', value: userName }));
            }}
            selected={isSelected}
        >
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Stack direction="row" spacing={2}>
                        {active === null ? (
                            <Avatar alt={name} src={name === '' ? IconUser : alphabetAvatar[`${name.toLowerCase()[0]}`]} />
                        ) : (
                            <StyledBadge
                                active={+active}
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt={name} src={name === '' ? IconUser : alphabetAvatar[`${name.toLowerCase()[0]}`]} />
                            </StyledBadge>
                        )}
                        <Stack spacing={0.3}>
                            <Typography variant="h5">{name}</Typography>
                            <Typography variant="subtitle2">{latestMessage && truncateText(latestMessage.message, 20)}</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack spacing={1.5} alignItems="center">
                        <Typography sx={{ fontWeight: 600 }} variant="caption">
                            {latestMessage &&
                                moment(latestMessage.updatedAt).calendar({
                                    sameDay: 'LT',
                                    lastWeek: 'ddd LT',
                                    sameElse: function (now) {
                                        if (this.isSame(now, 'year')) {
                                            return 'MMM D, LT';
                                        } else {
                                            return 'DD/MM/Y';
                                        }
                                    }
                                })}
                        </Typography>
                        <Badge className="unread-count" color="secondary" badgeContent={unRead} />
                    </Stack>
                </Grid>
            </Grid>
        </ListItemButton>
    );
};

ChatElement.propTypes = {
    chatProps: PropTypes.object
};

export default ChatElement;
