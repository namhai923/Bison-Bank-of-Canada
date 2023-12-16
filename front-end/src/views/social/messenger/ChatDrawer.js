import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Slide, Paper, useMediaQuery } from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

import Chats from './Chats';
import { chatWidth } from 'assets/data/constant';

const ChatDrawer = (props) => {
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));

    let { currentConversation, currentName, currentActive, contacts, chatOpened, chatToggle } = props;

    const drawer = (
        <>
            <BrowserView>
                <PerfectScrollbar
                    component="div"
                    style={{
                        paddingLeft: '16px',
                        paddingRight: '16px'
                    }}
                >
                    <Chats
                        contacts={contacts}
                        currentConversation={currentConversation}
                        currentName={currentName}
                        currentActive={currentActive}
                    />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <Chats
                        contacts={contacts}
                        currentConversation={currentConversation}
                        currentName={currentName}
                        currentActive={currentActive}
                    />
                </Box>
            </MobileView>
        </>
    );

    return (
        <>
            {matchUpLg ? (
                <Slide direction="right" in={chatOpened} mountOnEnter unmountOnExit>
                    <Paper sx={{ p: 2, width: chatWidth, height: '75vh', marginRight: 2 }}>
                        <Chats
                            contacts={contacts}
                            currentConversation={currentConversation}
                            currentName={currentName}
                            currentActive={currentActive}
                        />
                    </Paper>
                </Slide>
            ) : (
                <Box component="nav" sx={{ flexShrink: { md: 0 }, width: 'auto' }}>
                    <Drawer
                        variant={'temporary'}
                        anchor="left"
                        open={chatOpened}
                        onClose={chatToggle}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: chatWidth,
                                background: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                borderRight: 'none',
                                pt: 2
                            }
                        }}
                        ModalProps={{ keepMounted: true }}
                        color="inherit"
                    >
                        {drawer}
                    </Drawer>
                </Box>
            )}
        </>
    );
};

ChatDrawer.propTypes = {
    currentConversation: PropTypes.string,
    currentName: PropTypes.string,
    currentActive: PropTypes.bool,
    contacts: PropTypes.arrayOf(PropTypes.object),
    chatOpened: PropTypes.bool,
    chatToggle: PropTypes.func
};

export default ChatDrawer;
