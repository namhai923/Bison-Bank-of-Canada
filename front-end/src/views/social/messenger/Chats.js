import { useState } from 'react';
import PropTypes from 'prop-types';

import { Typography, Stack, Paper, Divider } from '@mui/material';
import { IconMessages, IconMessageSearch } from '@tabler/icons-react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import ChatElement from './ChatElement';
import StyledInput from 'components/styled-input';
import { useGetConversationsInfoQuery } from 'app/features/messenger/messengerApiSlice';
import config from 'assets/data/config';
import longTextDisplay from 'utils/longTextDisplay';

function applyFilter(array, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    if (query) {
        return array.filter((conversation) => conversation.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Chats = (props) => {
    let { currentConversation, currentName, currentActive, contacts } = props;

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

    const [filterName, setFilterName] = useState('');

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    let content;
    if (isConversationsInfoLoading) content = <Loader />;

    if (isConversationsInfoError) {
        content = <p className="errmsg">{conversationsInfoError?.data?.message}</p>;
    }
    if (isConversationsInfoSuccess) {
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
        if (currentConversation && !conversationsInfo.find((conversationInfo) => conversationInfo.userName === currentConversation)) {
            conversationsInfo.unshift({
                userName: currentConversation,
                name: currentName,
                active: currentActive,
                latestMessage: null,
                unRead: 0
            });
        }

        const filteredConversations = applyFilter(conversationsInfo, filterName);
        const isNotFound = !filteredConversations.length && !!filterName;

        content = (
            <Stack spacing={2} sx={{ height: '75vh' }}>
                <Stack alignItems="center" justifyContent="space-between" direction="row">
                    <Typography variant="h2">Chats</Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <IconMessages />
                    </Stack>
                </Stack>
                <StyledInput
                    value={filterName}
                    onChange={handleFilterByName}
                    placeholder="Search conversation"
                    StartIcon={IconMessageSearch}
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
                            <strong>{longTextDisplay(filterName, 34)}</strong>
                            <br /> Try checking for typos or using complete words.
                        </Typography>
                    </Paper>
                )}

                <PerfectScrollbar>
                    <Stack>
                        {filteredConversations.map((conversationInfo) => {
                            return (
                                <>
                                    <ChatElement chatProps={conversationInfo} />
                                    <Divider></Divider>
                                </>
                            );
                        })}
                    </Stack>
                </PerfectScrollbar>
            </Stack>
        );
    }

    return content;
};

Chats.propTypes = {
    currentConversation: PropTypes.string,
    currentName: PropTypes.string,
    currentActive: PropTypes.bool,
    contacts: PropTypes.arrayOf(PropTypes.object)
};

export default Chats;
