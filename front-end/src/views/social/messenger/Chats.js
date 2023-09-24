import { useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, Typography, Stack, Paper } from '@mui/material';
import { IconMessages } from '@tabler/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconListSearch } from '@tabler/icons';

import Loader from 'components/Loader';
import ChatElement from './ChatElement';
import StyledInput from 'components/styled-input';
import { useGetConversationsInfoQuery, useGetContactsQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

function applyFilter(array, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    if (query) {
        return array.filter((conversation) => conversation.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Chats = (props) => {
    let { currentConversation } = props;

    let {
        data: conversationsInfo,
        isLoading: isConversationsInfoLoading,
        isSuccess: isConversationsInfoSuccess,
        isError: isConversationsInfoError,
        error: conversationsInfoError
    } = useGetConversationsInfoQuery('conversationsInfo', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let {
        data: contacts,
        isLoading: isContactsLoading,
        isSuccess: isContactsSuccess,
        isError: isContactsError,
        error: contactsError
    } = useGetContactsQuery('contacts', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const [filterName, setFilterName] = useState('');

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    let content;
    if (isConversationsInfoLoading || isContactsLoading) content = <Loader />;

    if (isConversationsInfoError || isContactsError) {
        content = (
            <p className="errmsg">
                {conversationsInfoError?.data?.message} {contactsError?.data?.message}
            </p>
        );
    }
    if (isConversationsInfoSuccess && isContactsSuccess) {
        conversationsInfo = conversationsInfo.map((conversationInfo) => {
            const { userName, latestMessage, unRead } = conversationInfo;

            let chatProps = {
                name: userName,
                userName,
                latestMessage,
                unRead,
                active: null
            };
            for (let contact of contacts) {
                if (contact.userName === conversationInfo.userName) {
                    chatProps.name = `${contact.firstName} ${contact.lastName}`;
                    chatProps.active = contact.active;
                }
            }
            return chatProps;
        });
        if (
            currentConversation &&
            !conversationsInfo.find((conversationInfo) => conversationInfo.userName === currentConversation.userName)
        ) {
            conversationsInfo.unshift({ ...currentConversation, latestMessage: null, unRead: 0 });
        }

        const filteredConversations = applyFilter(conversationsInfo, filterName);
        const isNotFound = !filteredConversations.length && !!filterName;

        content = (
            <Stack container spacing={2} sx={{ height: '80vh' }}>
                <Stack alignItems={'center'} justifyContent="space-between" direction="row">
                    <Typography variant="h2">Chats</Typography>

                    <Stack direction={'row'} alignItems="center" spacing={1}>
                        <IconButton>
                            <IconMessages />
                        </IconButton>
                    </Stack>
                </Stack>
                <StyledInput
                    value={filterName}
                    onChange={handleFilterByName}
                    StartIcon={IconListSearch}
                    MobileIcon={IconListSearch}
                ></StyledInput>

                {isNotFound && (
                    <Paper
                        sx={{
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" paragraph>
                            Not found
                        </Typography>

                        <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                        </Typography>
                    </Paper>
                )}

                <PerfectScrollbar>
                    <Stack spacing={0.5}>
                        {filteredConversations.map((conversationInfo) => {
                            return <ChatElement chatProps={conversationInfo} />;
                        })}
                    </Stack>
                </PerfectScrollbar>
            </Stack>
        );
    }

    return content;
};

Chats.propTypes = {
    currentConversation: PropTypes.object
};

export default Chats;
