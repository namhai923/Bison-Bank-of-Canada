import PropTypes from 'prop-types';

import { Avatar, Box, CardContent, Typography } from '@mui/material';
import { IconUser } from '@tabler/icons-react';
import moment from 'moment/moment';

import SubCard from 'components/cards/SubCard';
import alphabetAvatar from 'assets/images/alphabetAvatar';

let AccountProfile = (props) => {
    let { firstName, lastName, dob, phoneNumber } = props;

    return (
        <SubCard>
            <CardContent>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        src={firstName === '' ? IconUser : alphabetAvatar[`${firstName.toLowerCase()[0]}`]}
                        sx={{
                            height: 80,
                            mb: 2,
                            width: 80
                        }}
                    />
                    <Typography gutterBottom variant="h5">
                        {firstName} {lastName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {dob && moment(dob).format('MMMM Do, Y')}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {phoneNumber && `${phoneNumber}`}
                    </Typography>
                </Box>
            </CardContent>
        </SubCard>
    );
};

AccountProfile.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
    phoneNumber: PropTypes.string
};

export default AccountProfile;
