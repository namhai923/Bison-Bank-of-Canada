import { useState, useRef, useEffect } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, MenuItem, Chip, TextField, ClickAwayListener, Divider, Paper, Popper, Stack, Typography, Grid } from '@mui/material';
import { IconFilter } from '@tabler/icons';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import CustomSelect from './extended/CustomSelect';
import categories from 'assets/data/categories';

const ProfileSection = () => {
    const theme = useTheme();

    let userInfo = useSelector((state) => state.user, shallowEqual);
    const [open, setOpen] = useState(false);

    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

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
                label="Filter"
                icon={<IconFilter />}
                sx={{
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light
                    }
                }}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-start"
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
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">All Notification</Typography>
                                                        <Chip
                                                            size="small"
                                                            label="01"
                                                            sx={{
                                                                color: theme.palette.background.default,
                                                                bgcolor: theme.palette.warning.dark
                                                            }}
                                                        />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid direction="column" spacing={2}>
                                                <Grid item xs={12}>
                                                    <Box sx={{ px: 2, pt: 0.25 }}>
                                                        <CustomSelect options={categories} />

                                                        <TextField id="select" label="Age" value="20" select>
                                                            <MenuItem value="10">Ten</MenuItem>
                                                            <MenuItem value="20">Twenty</MenuItem>
                                                        </TextField>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} p={0}>
                                                    <Divider sx={{ my: 0 }} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
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
