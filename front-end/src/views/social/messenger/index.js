import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Grid } from '@mui/material';

import Conversation from './Conversation';
import Chats from './Chats';
import { gridSpacing } from 'assets/data/constant';
import SubCard from 'components/cards/SubCard';
import noConversation from 'assets/images/bison.png';

const Messeger = () => {
    const theme = useTheme();

    let { currentConversation } = useSelector((state) => state.value);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={4} md={4} sm={12} xs={4}>
                <SubCard sx={{ backgroundColor: theme.palette.background.paper }}>
                    <Chats currentConversation={currentConversation} />
                </SubCard>
            </Grid>
            <Grid item lg={8} md={8} sm={12} xs={8}>
                <SubCard>
                    {currentConversation !== null ? (
                        <Conversation currentConversation={currentConversation} />
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
};

export default Messeger;
