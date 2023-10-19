import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Avatar, IconButton, Stack, Tooltip, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useResponsive from 'utils/useResponsive';
import { IconTrash, IconUser } from '@tabler/icons-react';

import Label from 'components/label';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { useDeleteConversationMutation } from 'app/features/user/userApiSlice';
import { setValue } from 'app/features/value/valueSlice';

const ConversationHeader = (props) => {
    const isMobile = useResponsive('between', 'md', 'xs', 'sm');
    const theme = useTheme();
    let dispatch = useDispatch();

    let { currentConversation, currentName, currentActive } = props;

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
        <Stack alignItems={'center'} direction={'row'} sx={{ width: '100%', height: '100%' }} justifyContent="space-between">
            <Stack spacing={2} direction="row">
                <Avatar alt={currentName} src={currentName ? alphabetAvatar[`${currentName.toLowerCase()[0]}`] : IconUser} />
                <Stack spacing={0.2}>
                    <Typography variant="h4">{currentName}</Typography>

                    <Box>
                        {currentActive === undefined ? (
                            ''
                        ) : (
                            <Label color={(currentActive && 'success') || 'error'}>{(currentActive && 'online') || 'offline'}</Label>
                        )}
                    </Box>
                </Stack>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={isMobile ? 1 : 3}>
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
    currentActive: PropTypes.bool
};

export default ConversationHeader;
