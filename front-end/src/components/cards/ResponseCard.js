import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Avatar, Stack, Button, Grid, Typography } from '@mui/material';
import { IconUser, IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import moment from 'moment/moment';

import SubCard from 'components/cards/SubCard';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { fCurrency } from 'utils/formatNumber';

const ResponseCard = (props) => {
    const { id, data, handleSubmit } = props;
    let { userName, amount, description, createdAt } = data;
    let theme = useTheme();

    return (
        <SubCard
            sx={{
                backgroundColor: `${theme.palette.primary.light}`,
                ':hover': { border: '1px solid', borderColor: `${theme.palette.primary.main}` }
            }}
        >
            <Stack spacing={1}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Avatar
                            sx={{ width: 56, height: 56 }}
                            alt={userName}
                            src={userName === '' ? IconUser : alphabetAvatar[`${userName.toLowerCase()[0]}`]}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">{moment(createdAt).fromNow()}</Typography>
                    </Grid>
                </Grid>
                <Stack direction="row" justifyContent="space-between">
                    <Stack>
                        <Typography variant="caption" color="inherit">
                            From
                        </Typography>
                        <Typography variant="h6" color="inherit">
                            {userName}
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="caption" color="inherit">
                            Amount
                        </Typography>
                        <Typography variant="h6" color="inherit">
                            {fCurrency(amount.toString())}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack>
                    <Typography variant="caption" color="inherit">
                        Description
                    </Typography>
                    <Typography variant="h6" color="inherit">
                        {description === '' ? 'No Description' : description}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<IconCircleX />}
                        onClick={() => handleSubmit(false, id)}
                        sx={{
                            '&:hover': {
                                // border: 0,
                                background: theme.palette.error.main,
                                color: theme.palette.background.paper
                            }
                        }}
                    >
                        Decline
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<IconCircleCheck />}
                        onClick={() => handleSubmit(true, id)}
                        sx={{
                            '&:hover': {
                                // border: 0,
                                background: theme.palette.success.main,
                                color: theme.palette.background.paper
                            }
                        }}
                    >
                        Accept
                    </Button>
                </Stack>
            </Stack>
        </SubCard>
    );
};

ResponseCard.propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    handleSubmit: PropTypes.func
};

export default ResponseCard;
