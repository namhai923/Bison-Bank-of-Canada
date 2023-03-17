import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
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

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import blankState from 'assets/data/blankState';
import { setUser } from 'views/authentication/userSlice';

// assets
import { IconLogout, IconSettings } from '@tabler/icons';

const ProfileSection = () => {
    const theme = useTheme();
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let userInfo = useSelector((state) => state.user);
    let customization = useSelector((state) => state.customization);
    const [open, setOpen] = useState(false);
    let [icon, setIcon] = useState(() => {
        let icon = alphabetAvatar.b;
        for (let key of Object.keys(alphabetAvatar)) {
            if (key === Array.from(userInfo.firstName.toLowerCase())[0]) {
                icon = alphabetAvatar[key];
            }
        }
        return icon;
    });

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleLogout = async (event) => {
        let action = setUser(blankState);
        dispatch(action);
        navigate('/');
        localStorage.clear();
        handleClose(event);
        setIcon(alphabetAvatar.b);
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

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open, userInfo]);

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
                        src={icon}
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
                                                Good Morning,
                                            </Typography>
                                            <Typography component="span" variant="h4">
                                                {userInfo.firstName} {userInfo.lastName}!
                                            </Typography>
                                        </Stack>
                                        <Divider />
                                    </Box>

                                    <ListItemButton sx={{ borderRadius: `${customization.borderRadius}px` }} onClick={handleLogout}>
                                        <ListItemIcon>
                                            <IconLogout stroke={1.5} size="1.3rem" />
                                        </ListItemIcon>
                                        <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                    </ListItemButton>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
