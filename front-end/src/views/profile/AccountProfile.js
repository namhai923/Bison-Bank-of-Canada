import { useSelector } from 'react-redux';

import { Avatar, Box, CardContent, Typography } from '@mui/material';
import { IconUser } from '@tabler/icons';

import SubCard from 'ui-component/cards/SubCard';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import months from 'assets/data/months';

let AccountProfile = () => {
    let userInfo = useSelector((state) => state.user);
    let dob = new Date(userInfo.dob);

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
                        src={userInfo.firstName === '' ? IconUser : alphabetAvatar[`${userInfo.firstName.toLowerCase()[0]}`]}
                        sx={{
                            height: 80,
                            mb: 2,
                            width: 80
                        }}
                    />
                    <Typography gutterBottom variant="h5">
                        {userInfo.firstName} {userInfo.lastName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {userInfo.dob && `${months[`${dob.getMonth()}`]} ${dob.getDate()}, ${dob.getFullYear()}`}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {userInfo.phoneNumber && `${userInfo.phoneNumber}`}
                    </Typography>
                </Box>
            </CardContent>
        </SubCard>
    );
};

export default AccountProfile;
