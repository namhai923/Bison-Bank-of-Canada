import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { IconMenu2 } from '@tabler/icons';
import jwtDecode from 'jwt-decode';

import Loader from 'components/Loader';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import WelcomeSection from './WelcomeSection';
import LogoSection from '../LogoSection';
import { useGetUserInfoQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    let token = useSelector((state) => state.auth.token);

    let {
        data: userInfo,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserInfoQuery(jwtDecode(token).userName, {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !token
    });

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess)
        content = (
            <>
                <Box
                    sx={{
                        width: 228,
                        display: 'flex',
                        [theme.breakpoints.down('md')]: {
                            width: 'auto'
                        }
                    }}
                >
                    <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                        <LogoSection />
                    </Box>
                    <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.light
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color="inherit"
                        >
                            <IconMenu2 stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                </Box>

                <WelcomeSection firstName={userInfo.firstName} />
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ flexGrow: 1 }} />

                <NotificationSection />
                <ProfileSection firstName={userInfo.firstName} lastName={userInfo.lastName} />
            </>
        );
    return content;
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
