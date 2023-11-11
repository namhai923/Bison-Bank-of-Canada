import { useState, useRef } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Paper, Popper, TableContainer, Table, TableBody, TableRow, TableCell, useMediaQuery, Typography } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconUserSearch, IconBackspaceFilled } from '@tabler/icons-react';
import escapeStringRegexp from 'escape-string-regexp';
import { toast } from 'react-toastify';

import Transitions from 'components/extended/Transitions';
import StyledInput from 'components/styled-input';
import MainCard from 'components/cards/MainCard';
import Loader from 'components/loader/Loader';
import UtilityBar from 'components/utility-bar/UtilityBar';
import { useSearchUserMutation } from 'app/features/user/userApiSlice';
import { useAddContactMutation } from 'app/features/contact/contactApiSlice';

const SearchUserSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [display, setDisplay] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    let [searchUser, { data, isLoading }] = useSearchUserMutation();
    let handleSearchUser = async (event) => {
        setSearchQuery(event.target.value);
        let searchQuery = escapeStringRegexp(event.target.value);
        if (event.target.value !== '') {
            await searchUser(searchQuery);
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    let handleClick = () => {
        setSearchQuery('');
        setOpen(false);
    };

    let [addContact] = useAddContactMutation();
    let handleAddContact = async (userName) => {
        toast.promise(addContact({ userName }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: 'Contact added 🎉🎉🎉',
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        ml: 0,
                        mr: 2
                    }
                }}
                ref={anchorRef}
            >
                <StyledInput
                    value={searchQuery}
                    onChange={handleSearchUser}
                    placeholder="Search Email/Username"
                    StartIcon={IconUserSearch}
                    MobileIcon={IconUserSearch}
                    EndIcon={IconBackspaceFilled}
                    endButtonClick={handleClick}
                />
            </Box>
            <Popper
                placement="bottom"
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
                                offset: [matchesXs ? 100 : 0, matchesXs ? 30 : 10]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position="top" in={open} {...TransitionProps}>
                        <Paper sx={{ minWidth: 300, background: `${theme.palette.primary.main}` }}>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <PerfectScrollbar>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableBody>
                                                    {data.map((userInfo) => {
                                                        let { userName } = userInfo;
                                                        return (
                                                            <TableRow
                                                                hover
                                                                key={userName}
                                                                tabIndex={-1}
                                                                role="checkbox"
                                                                onMouseEnter={() => setDisplay(userName)}
                                                                onMouseLeave={() => setDisplay(null)}
                                                            >
                                                                <TableCell align="left">{userName}</TableCell>

                                                                <TableCell padding="none" align="right" width="auto">
                                                                    {(matchesXs || display === userName) && (
                                                                        <UtilityBar
                                                                            singleValue={userName}
                                                                            sendMessage
                                                                            handleAddContact={handleAddContact}
                                                                        ></UtilityBar>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>

                                                {data.length === 0 && (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                                <Paper
                                                                    sx={{
                                                                        textAlign: 'center'
                                                                    }}
                                                                >
                                                                    <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                                                                        No user found!
                                                                    </Typography>
                                                                </Paper>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                    </PerfectScrollbar>
                                )}
                            </MainCard>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default SearchUserSection;
