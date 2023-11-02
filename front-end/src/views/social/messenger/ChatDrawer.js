import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Slide, Paper, useMediaQuery } from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

import Chats from './Chats';
import { chatWidth, drawerWidth } from 'assets/data/constant';

const ChatDrawer = (props) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    let { currentConversation, currentName, currentActive, contacts, chatOpened, chatToggle, window } = props;

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

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <>
            {matchUpMd ? (
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
                <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? chatWidth : 'auto' }}>
                    <Drawer
                        container={container}
                        variant={matchUpMd ? 'persistent' : 'temporary'}
                        anchor="left"
                        open={chatOpened}
                        onClose={chatToggle}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
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
    chatToggle: PropTypes.func,
    window: PropTypes.object
};

export default ChatDrawer;
