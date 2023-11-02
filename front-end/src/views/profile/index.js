import { Container, Unstable_Grid2 as Grid } from '@mui/material';
import { toast } from 'react-toastify';

import Loader from 'components/loader/Loader';
import MainCard from 'components/cards/MainCard';
import AccountProfile from './AccountProfile';
import ProFileForm from './ProfileForm';
import { useGetUserInfoQuery, useUpdateUserInfoMutation } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const Profile = () => {
    let {
        data: userInfo,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserInfoQuery('userInfo', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const [updateUserInfo] = useUpdateUserInfoMutation();

    let handleSubmit = async (values) => {
        toast.promise(
            updateUserInfo({
                firstName: values.fname,
                lastName: values.lname,
                dob: values.dob ?? '',
                phoneNumber: values.phone
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Profile updated 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
    };

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess)
        content = (
            <MainCard title="User Profile">
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6} lg={4}>
                            <AccountProfile
                                firstName={userInfo.firstName}
                                lastName={userInfo.lastName}
                                dob={userInfo.dob}
                                phoneNumber={userInfo.phoneNumber}
                            />
                        </Grid>
                        <Grid xs={12} md={6} lg={8}>
                            <ProFileForm
                                firstName={userInfo.firstName}
                                lastName={userInfo.lastName}
                                dob={userInfo.dob}
                                phoneNumber={userInfo.phoneNumber}
                                handleSubmit={handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </MainCard>
        );
    return content;
};

export default Profile;
