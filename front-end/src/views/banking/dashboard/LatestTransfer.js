import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import jwtDecode from 'jwt-decode';

// project imports
import MainCard from 'components/cards/MainCard';
import { sortByTime } from 'utils/timeUtils';

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

const LatestTransfer = (props) => {
    const theme = useTheme();
    let { transferHistory } = props;

    let token = useSelector((state) => state.auth.token);
    let userName = jwtDecode(token).userName;

    let [latest, setLatest] = useState(() => {
        let latestTransfer = 0;
        let sendTransfer = transferHistory.filter((transfer) => transfer.sender === userName);
        if (sendTransfer.length > 0) {
            latestTransfer = sortByTime(sendTransfer)[sendTransfer.length - 1].amount;
        }
        return latestTransfer;
    });

    useEffect(() => {
        let latestTransfer = 0;
        let sendTransfer = transferHistory.filter((transfer) => transfer.sender === userName);
        if (sendTransfer.length > 0) {
            latestTransfer = sortByTime(sendTransfer)[sendTransfer.length - 1].amount;
        }
        setLatest(latestTransfer);
    }, [transferHistory, userName]);

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

LatestTransfer.propTypes = {
    transferHistory: PropTypes.arrayOf(PropTypes.object)
};

export default LatestTransfer;
