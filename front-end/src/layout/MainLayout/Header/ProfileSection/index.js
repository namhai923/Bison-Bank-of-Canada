import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import moment from 'moment/moment';

import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { useLogoutMutation } from 'app/features/auth/authApiSlice';
import longTextDisplay from 'utils/longTextDisplay';

const ProfileSection = (props) => {
    let { firstName, lastName } = props;
    const theme = useTheme();
    let navigate = useNavigate();
    const [open, setOpen] = useState(false);

    let customization = useSelector((state) => state.customization);

    let [logout] = useLogoutMutation();

    const anchorRef = useRef(null);

    const handleLogout = async (event) => {
        try {
            await logout();
            navigate('/login');
            handleClose(event);
        } catch (err) {
            console.log(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    let profileClick = (event) => {
        navigate('/profile');
        handleClose(event);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={firstName === '' ? IconUser : alphabetAvatar[`${firstName.toLowerCase()[0]}`]}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="h4" sx={{ fontWeight: 400 }}>
                                                {6 < moment().hour() && moment().hour() <= 12
                                                    ? 'Good Morning,'
                                                    : 12 < moment().hour() && moment().hour() <= 17
                                                    ? 'Good Afternoon,'
                                                    : 17 < moment().hour() && moment().hour() <= 21
                                                    ? 'Good Evening,'
                                                    : 'Good Night,'}
                                            </Typography>
                                            <Typography component="span" variant="h4">
                                                {`${longTextDisplay(`${firstName} ${lastName}`, 20)}!`}
                                            </Typography>
                                        </Stack>
                                        <Divider />
                                    </Box>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={profileClick}>
                                            <ListItemIcon>
                                                <IconUser stroke={1.5} size="1.3rem" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="body2">User Profile</Typography>} />
                                        </ListItemButton>

                                        <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleLogout}>
                                            <ListItemIcon>
                                                <IconLogout stroke={1.5} size="1.3rem" />
                                            </ListItemIcon>
                                            <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                        </ListItemButton>
                                    </Box>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

ProfileSection.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string
};

export default ProfileSection;
