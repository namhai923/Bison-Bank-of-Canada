import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Avatar, ButtonBase, IconButton, Stack, Tooltip, Typography, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconTrash, IconUser, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { AvatarStyle } from 'components/styled-input';
import Label from 'components/label';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { useDeleteConversationMutation } from 'app/features/messenger/messengerApiSlice';
import { setValue } from 'app/features/value/valueSlice';
import longTextDisplay from 'utils/longTextDisplay';

const ConversationHeader = (props) => {
    const theme = useTheme();
    let dispatch = useDispatch();
    let matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    let matchDownMobile = useMediaQuery(theme.breakpoints.down('mobile'));

    let { currentConversation, currentName, currentActive, handleChatToggle, chatOpened } = props;

    let [deleteConversation] = useDeleteConversationMutation();
    let handleDeleteConversation = async () => {
        try {
            await deleteConversation(currentConversation);
            dispatch(setValue({ type: 'currentConversation', value: null }));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Stack alignItems="center" direction="row" sx={{ width: '100%', height: '100%' }} justifyContent="space-between">
            <Stack spacing={1} direction="row" alignItems="center">
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <AvatarStyle variant="rounded" color={theme.palette.secondary} onClick={handleChatToggle}>
                        {chatOpened ? <IconChevronLeft stroke={1.5} size="1.3rem" /> : <IconChevronRight stroke={1.5} size="1.3rem" />}
                    </AvatarStyle>
                </ButtonBase>
                <Avatar alt={currentName} src={currentName ? alphabetAvatar[`${currentName.toLowerCase()[0]}`] : IconUser} />
                <Stack spacing={0.2}>
                    <Typography variant="h4">
                        {matchDownMobile ? longTextDisplay(currentName, 15) : matchDownSM ? longTextDisplay(currentName, 38) : currentName}
                    </Typography>

                    <Box>
                        {currentActive === undefined ? (
                            ''
                        ) : (
                            <Label color={(currentActive && 'success') || 'error'}>{(currentActive && 'online') || 'offline'}</Label>
                        )}
                    </Box>
                </Stack>
            </Stack>
            <Stack direction="row" alignItems="center">
                <Tooltip title="Delete conversation">
                    <IconButton onClick={handleDeleteConversation}>
                        <IconTrash color={theme.palette.error.dark} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

ConversationHeader.propTypes = {
    currentConversation: PropTypes.string,
    currentName: PropTypes.string,
    currentActive: PropTypes.bool,
    handleChatToggle: PropTypes.func,
    chatOpened: PropTypes.bool
};

export default ConversationHeader;
