import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Box, Badge, Stack, Avatar, Typography } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { IconUser } from '@tabler/icons';
import { displayTime } from 'utils/timeUtils';
import { setValue } from 'app/features/value/valueSlice';

const truncateText = (string, n) => {
    return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(() => ({
    '&:hover': {
        cursor: 'pointer'
    }
}));

const StyledBadge = styled(Badge)(({ theme, active }) => {
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

    const theme = useTheme();
    let dispatch = useDispatch();

    let { currentConversation } = useSelector((state) => state.value);
    let isSelected = false;
    if (currentConversation) {
        isSelected = userName === currentConversation.userName;
    }

    return (
        <StyledChatBox
            onClick={() => {
                dispatch(setValue({ type: 'currentConversation', value: { name, userName, active } }));
            }}
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: isSelected ? alpha(theme.palette.primary[200], 0.5) : theme.palette.grey[100]
            }}
            p={2}
        >
            <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                <Stack direction="row" spacing={2}>
                    {active === null ? (
                        <Avatar alt={name} src={name === '' ? IconUser : alphabetAvatar[`${name.toLowerCase()[0]}`]} />
                    ) : (
                        <StyledBadge
                            active={active}
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                        >
                            <Avatar alt={name} src={name === '' ? IconUser : alphabetAvatar[`${name.toLowerCase()[0]}`]} />
                        </StyledBadge>
                    )}
                    <Stack spacing={0.3}>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="subtitle2">{latestMessage && truncateText(latestMessage.message, 20)}</Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={'center'}>
                    <Typography sx={{ fontWeight: 600 }} variant="caption">
                        {latestMessage && displayTime(new Date(latestMessage.updatedAt))}
                    </Typography>
                    <Badge className="unread-count" color="primary" badgeContent={unRead} />
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

ChatElement.propTypes = {
    chatProps: PropTypes.object
};

export default ChatElement;
