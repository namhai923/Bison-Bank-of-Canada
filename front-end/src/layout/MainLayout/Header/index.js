import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Box, ButtonBase, Typography, Stack, useMediaQuery, Tooltip } from '@mui/material';
import { IconMenu2, IconStarFilled } from '@tabler/icons-react';

import Loader from 'components/loader/Loader';
import NotificationSection from './NotificationSection';
import ProfileSection from './ProfileSection';
import WelcomeSection from './WelcomeSection';
import SearchUserSection from './SearchUserSection';
import LogoSection from '../LogoSection';
import { useGetUserInfoQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';
import { AvatarStyle } from 'components/styled-input';

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));

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
                        <AvatarStyle variant="rounded" color={theme.palette.secondary} onClick={handleLeftDrawerToggle}>
                            <IconMenu2 stroke={1.5} size="1.3rem" />
                        </AvatarStyle>
                    </ButtonBase>
                </Box>

                {!matchDownLg && <WelcomeSection firstName={userInfo.firstName} />}
                <SearchUserSection></SearchUserSection>
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" justifyContent="center">
                    <Typography variant="subtitle1"> {userInfo.creditPoints} </Typography>
                    <Tooltip title="Credit Points">
                        <Box sx={{ display: 'flex', color: `${theme.palette.warning.dark}` }}>
                            <IconStarFilled stroke={1.5} size="1.3rem" />
                        </Box>
                    </Tooltip>
                </Stack>
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
