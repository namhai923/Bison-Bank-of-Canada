import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import sortByTime from 'utils/sortByTime';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const LatestTransfer = () => {
    const theme = useTheme();
    let userInfo = useSelector((state) => state.user);
    let [latest, setLatest] = useState(() => {
        let latestTransfer = 0;
        if (userInfo.transferHistory.length > 0) {
            latestTransfer = sortByTime(userInfo.transferHistory)[userInfo.transferHistory.length - 1].amount;
        }
        return latestTransfer;
    });

    useEffect(() => {
        let latestTransfer = 0;
        if (userInfo.transferHistory.length > 0) {
            latestTransfer = sortByTime(userInfo.transferHistory)[userInfo.transferHistory.length - 1].amount;
        }
        setLatest(latestTransfer);
    }, [userInfo]);

    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor: theme.palette.warning.light,
                                        color: theme.palette.warning.dark
                                    }}
                                >
                                    <StorefrontTwoToneIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={<Typography variant="h4">${latest}</Typography>}
                                secondary={
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: theme.palette.grey[500],
                                            mt: 0.5
                                        }}
                                    >
                                        Latest Transfer
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
        </>
    );
};

export default LatestTransfer;
