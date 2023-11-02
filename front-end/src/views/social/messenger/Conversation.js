import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { Stack, Box, Divider, useMediaQuery } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import ConverationHeader from './ConversationHeader';
import ConversationFooter from './ConversationFooter';
import { TextMsg } from './ConversationElement';
import { useGetConversationQuery } from 'app/features/messenger/messengerApiSlice';
import config from 'assets/data/config';

const Conversation = (props) => {
    let { currentConversation, currentName, currentActive, handleChatToggle, chatOpened } = props;
    let theme = useTheme();

    let { data, isLoading, isSuccess, isError, error } = useGetConversationQuery(currentConversation, {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !currentConversation
    });
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const [scrollEl, setScrollEl] = useState();

    useEffect(() => {
        if (scrollEl) {
            // Set the scroll position to the bottom
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
    }, [scrollEl, currentConversation, data]);

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        content = (
            <Stack height="75vh">
                <Stack spacing={2}>
                    <ConverationHeader
                        currentConversation={currentConversation}
                        currentName={currentName}
                        currentActive={currentActive}
                        handleChatToggle={handleChatToggle}
                        chatOpened={chatOpened}
                    />
                    <Divider sx={{ my: 0 }} />
                </Stack>

                <PerfectScrollbar containerRef={setScrollEl}>
                    <Box p={matchDownMd ? 1 : 3}>
                        <Stack spacing={matchDownMd ? 1 : 3}>
                            {data.map((messageProps) => (
                                <TextMsg messageProps={messageProps} />
                            ))}
                        </Stack>
                    </Box>
                </PerfectScrollbar>

                <ConversationFooter currentConversation={currentConversation} />
            </Stack>
        );
    }

    return content;
};

Conversation.propTypes = {
    currentConversation: PropTypes.string,
    currentName: PropTypes.string,
    currentActive: PropTypes.bool,
    handleChatToggle: PropTypes.func,
    chatOpened: PropTypes.bool
};

export default Conversation;
