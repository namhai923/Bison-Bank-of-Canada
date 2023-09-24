import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Avatar, IconButton, Stack, Tooltip, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useResponsive from 'utils/useResponsive';
import { IconTrash } from '@tabler/icons';

import Label from 'components/label';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { useDeleteConversationMutation } from 'app/features/user/userApiSlice';
import { setValue } from 'app/features/value/valueSlice';

const ConversationHeader = (props) => {
    const isMobile = useResponsive('between', 'md', 'xs', 'sm');
    const theme = useTheme();
    let dispatch = useDispatch();

    let { currentConversation } = props;
    let { name, userName, active } = currentConversation;

    let [deleteConvesation] = useDeleteConversationMutation();
    let handleDeleteConversation = async () => {
        try {
            await deleteConvesation(userName);
            dispatch(setValue({ type: 'currentConversation', value: null }));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Stack alignItems={'center'} direction={'row'} sx={{ width: '100%', height: '100%' }} justifyContent="space-between">
            <Stack spacing={2} direction="row">
                <Avatar alt={name} src={name === '' ? IconUser : alphabetAvatar[`${name.toLowerCase()[0]}`]} />
                <Stack spacing={0.2}>
                    <Typography variant="h4">{name}</Typography>

                    <Box>
                        {active === null ? '' : <Label color={(active && 'success') || 'error'}>{(active && 'online') || 'offline'}</Label>}
                    </Box>
                </Stack>
            </Stack>
            <Stack direction={'row'} alignItems="center" spacing={isMobile ? 1 : 3}>
                <Tooltip title="Delete chat">
                    <IconButton onClick={handleDeleteConversation}>
                        <IconTrash color={theme.palette.error.dark} />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

ConversationHeader.propTypes = {
    currentConversation: PropTypes.object
};

export default ConversationHeader;
