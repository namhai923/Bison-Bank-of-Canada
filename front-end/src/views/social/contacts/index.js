import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import {
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popper,
    ClickAwayListener,
    Checkbox,
    CardContent,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Box,
    Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { toast } from 'react-toastify';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { IconUser, IconTrash, IconMessageCircle, IconCoins } from '@tabler/icons';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/Loader';
import Label from 'components/label';
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import ContactsListHead from './ContactsListHead';
import ContactsListToolbar from './ContactsListToolbar';
import AddContactForm from './AddContactForm';
import { useAddContactMutation, useGetContactsQuery, useRemoveContactMutation } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

import Transitions from 'components/extended/Transitions';
import { setValue } from 'app/features/value/valueSlice';
import { openMenu } from 'app/features/customize/customizeSlice';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'userName', label: 'Email', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return array.filter((user) => user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Contacts = () => {
    let theme = useTheme();
    let {
        data: contacts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetContactsQuery('contacts', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    const [display, setDisplay] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const anchorRef = useRef(null);
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenAdd(false);
    };
    const handleToggle = () => {
        setOpenAdd((prevOpen) => !prevOpen);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = contacts.map((n) => n.userName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    let [addContact] = useAddContactMutation();
    let handleAddContact = async (values) => {
        toast.promise(addContact({ userName: values.email }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: 'Contact added 🎉🎉🎉',
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    let dispatch = useDispatch();
    let navigate = useNavigate();
    let handleMessage = (selectedUser) => {
        dispatch(setValue({ type: 'currentConversation', value: selectedUser }));
        dispatch(openMenu('messenger'));
        navigate('/messenger');
    };

    let handleTransfer = (selectedContacts) => {
        dispatch(setValue({ type: 'emails', value: selectedContacts }));
        dispatch(openMenu('spend'));
        navigate('/spend');
    };

    let [removeContact] = useRemoveContactMutation();
    let handleRemoveContacts = async (removeContacts) => {
        toast.promise(removeContact({ removeContacts }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: {
                render() {
                    let newSelected = selected.filter((contact) => !removeContacts.includes(contact));
                    setSelected(newSelected);
                    return 'Contact removed 🎉🎉🎉';
                }
            },
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        contacts = contacts.map((contact) => ({ ...contact, name: `${contact.firstName} ${contact.lastName}` }));

        const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contacts.length) : 0;
        const filteredUsers = applySortFilter(contacts, getComparator(order, orderBy), filterName);
        const isNotFound = !filteredUsers.length && !!filterName;

        content = (
            <MainCard
                title="Contacts"
                secondary={
                    <Button variant="contained" ref={anchorRef} onClick={handleToggle}>
                        Add Contact
                    </Button>
                }
            >
                <CardContent>
                    {contacts.length === 0 ? (
                        <Typography variant="h2" align="center">
                            You don't have any contacts so far. Add a new contact to get started!
                        </Typography>
                    ) : (
                        <>
                            <ContactsListToolbar
                                selected={selected}
                                filterName={filterName}
                                onFilterName={handleFilterByName}
                                handleTransfer={handleTransfer}
                                handleRemoveContacts={handleRemoveContacts}
                            />
                            <SubCard>
                                <PerfectScrollbar>
                                    <TableContainer component={Paper} sx={{ minWidth: 800 }}>
                                        <Table>
                                            <ContactsListHead
                                                order={order}
                                                orderBy={orderBy}
                                                headLabel={TABLE_HEAD}
                                                rowCount={contacts.length}
                                                numSelected={selected.length}
                                                onRequestSort={handleRequestSort}
                                                onSelectAllClick={handleSelectAllClick}
                                            />
                                            <TableBody>
                                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                    const { name, userName, active } = row;
                                                    const selectedUser = selected.indexOf(userName) !== -1;

                                                    return (
                                                        <TableRow
                                                            hover
                                                            tabIndex={-1}
                                                            role="checkbox"
                                                            selected={selectedUser}
                                                            onMouseEnter={() => setDisplay(userName)}
                                                            onMouseLeave={() => setDisplay(null)}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={selectedUser}
                                                                    onChange={(event) => handleClick(event, userName)}
                                                                />
                                                            </TableCell>

                                                            <TableCell component="th" scope="row" padding="none">
                                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                                    <Avatar
                                                                        alt={name}
                                                                        src={
                                                                            name === ''
                                                                                ? IconUser
                                                                                : alphabetAvatar[`${name.toLowerCase()[0]}`]
                                                                        }
                                                                    />
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {name}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>

                                                            <TableCell align="left">{userName}</TableCell>

                                                            <TableCell align="left">
                                                                <Label color={(active && 'success') || 'error'}>
                                                                    {(active && 'online') || 'offline'}
                                                                </Label>
                                                            </TableCell>

                                                            <TableCell padding="none" align="right" width="20%">
                                                                {display === userName && (
                                                                    <>
                                                                        <Tooltip title="Message">
                                                                            <IconButton
                                                                                onClick={() => handleMessage({ name, userName, active })}
                                                                            >
                                                                                <IconMessageCircle stroke={1.5} size="1.3rem" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Transfer">
                                                                            <IconButton onClick={() => handleTransfer([userName])}>
                                                                                <IconCoins stroke={1.5} size="1.3rem" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Remove">
                                                                            <IconButton onClick={() => handleRemoveContacts([userName])}>
                                                                                <IconTrash
                                                                                    stroke={1.5}
                                                                                    size="1.3rem"
                                                                                    color={theme.palette.error.dark}
                                                                                />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                        <TableCell colSpan={6} />
                                                    </TableRow>
                                                )}
                                            </TableBody>

                                            {isNotFound && (
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                            <Paper
                                                                sx={{
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                <Typography variant="h6" paragraph>
                                                                    Not found
                                                                </Typography>

                                                                <Typography variant="body2">
                                                                    No results found for &nbsp;
                                                                    <strong>&quot;{filterName}&quot;</strong>.
                                                                    <br /> Try checking for typos or using complete words.
                                                                </Typography>
                                                            </Paper>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            )}
                                        </Table>
                                    </TableContainer>
                                </PerfectScrollbar>
                            </SubCard>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={contacts.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </CardContent>

                <Popper
                    placement="bottom-end"
                    open={openAdd}
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
                        <Transitions in={openAdd} {...TransitionProps}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <Box>
                                        <AddContactForm handleSubmit={handleAddContact} />
                                    </Box>
                                </ClickAwayListener>
                            </Paper>
                        </Transitions>
                    )}
                </Popper>
            </MainCard>
        );
    }

    return content;
};

export default Contacts;
