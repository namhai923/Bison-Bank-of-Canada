import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Stack, Box, Divider } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/Loader';
import ConverationHeader from './ConversationHeader';
import ConversationFooter from './ConversationFooter';
import { TextMsg } from './ConversationElement';

import useResponsive from 'utils/useResponsive';
import { useGetConversationQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const Conversation = (props) => {
    let { currentConversation } = props;

    let { data, isLoading, isSuccess, isError, error } = useGetConversationQuery(currentConversation.userName, {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !currentConversation
    });
    const isMobile = useResponsive('between', 'md', 'xs', 'sm');

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
            <Stack height={'80vh'} width={isMobile ? '100vw' : 'auto'}>
                <Stack spacing={2}>
                    <ConverationHeader currentConversation={currentConversation} />
                    <Divider sx={{ my: 0 }} />
                </Stack>

                <PerfectScrollbar containerRef={setScrollEl}>
                    <Box p={isMobile ? 1 : 3}>
                        <Stack spacing={3}>
                            {data.map((messageProps) => (
                                <TextMsg messageProps={messageProps} />
                            ))}
                        </Stack>
                    </Box>
                </PerfectScrollbar>

                <ConversationFooter userName={currentConversation.userName} />
            </Stack>
        );
    }

    return content;
};

Conversation.propTypes = {
    currentConversation: PropTypes.object
};

export default Conversation;
