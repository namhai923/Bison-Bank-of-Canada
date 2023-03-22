// material-ui
import { Container, Unstable_Grid2 as Grid } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AccountProfile from './AccountProfile';
import ProFileForm from './ProfileForm';

const Profile = () => (
    <MainCard title="User Profile">
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                    <AccountProfile />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                    <ProFileForm />
                </Grid>
            </Grid>
        </Container>
    </MainCard>
);

export default Profile;
