import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Grid, Paper } from '@mui/material';

import Loader from 'components/Loader';
import Conversation from './Conversation';
import Chats from './Chats';
import { gridSpacing } from 'assets/data/constant';
import SubCard from 'components/cards/SubCard';
import noConversation from 'assets/images/bison.png';
import { useGetContactsQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const Messeger = () => {
    const theme = useTheme();

    let currentConversation = useSelector((state) => state.value.currentConversation);

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

    let content;
    if (isContactsLoading) content = <Loader />;

    if (isContactsError) {
        content = <p className="errmsg">{contactsError?.data?.message}</p>;
    }
    if (isContactsSuccess) {
        let currentName = currentConversation;
        let currentActive;
        if (currentConversation) {
            for (let contact of contacts) {
                if (contact.userName === currentConversation) {
                    currentName = `${contact.firstName} ${contact.lastName}`;
                    currentActive = contact.active;
                }
            }
        }

        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h3">Messenger</Typography>
                    </Paper>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={4}>
                    <SubCard sx={{ backgroundColor: theme.palette.background.paper }}>
                        <Chats
                            contacts={contacts}
                            currentConversation={currentConversation}
                            currentName={currentName}
                            currentActive={currentActive}
                        />
                    </SubCard>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={8}>
                    <SubCard>
                        {currentConversation !== null ? (
                            <Conversation
                                currentConversation={currentConversation}
                                currentName={currentName}
                                currentActive={currentActive}
                            />
                        ) : (
                            <Stack height={'80vh'} spacing={2} alignItems="center" justifyContent={'center'}>
                                <img src={noConversation} alt="Bison Bank of Canada" width="360" height="360" />
                                <Typography variant="subtitle2">Select a conversation or start a new one</Typography>
                            </Stack>
                        )}
                    </SubCard>
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Messeger;
