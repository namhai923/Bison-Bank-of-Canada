import { useState, useRef } from 'react';

import {
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popper,
    ClickAwayListener,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TablePagination,
    Box,
    Grid,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { toast } from 'react-toastify';
import alphabetAvatar from 'assets/images/alphabetAvatar';
import { IconUser } from '@tabler/icons-react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import Label from 'components/label';
import SubCard from 'components/cards/SubCard';
import ContactsListHead from './ContactsListHead';
import ContactsListToolbar from './ContactsListToolbar';
import AddContactForm from './AddContactForm';
import Transitions from 'components/extended/Transitions';
import UtilityBar from 'components/utility-bar/UtilityBar';
import { useAddContactMutation, useGetContactsQuery, useRemoveContactMutation } from 'app/features/contact/contactApiSlice';
import config from 'assets/data/config';
import { gridSpacing } from 'assets/data/constant';
import longTextDisplay from 'utils/longTextDisplay';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'userName', label: 'Email', alignRight: false },
    { id: 'active', label: 'Status', alignRight: false },
    { id: '' }
];

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
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

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
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('active');
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
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                            <Grid item>
                                <Typography align="center" variant="h3">
                                    Contacts
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" ref={anchorRef} onClick={handleToggle}>
                                    Add Contact
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <SubCard>
                        {contacts.length === 0 ? (
                            <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                                You don't have any contacts so far. Add a new contact to get started!
                            </Typography>
                        ) : (
                            <>
                                <ContactsListToolbar
                                    selected={selected}
                                    filterName={filterName}
                                    onFilterName={handleFilterByName}
                                    handleRemoveContacts={handleRemoveContacts}
                                />
                                <SubCard>
                                    <PerfectScrollbar>
                                        <TableContainer component={Paper} sx={{ minWidth: 600 }}>
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
                                                    {filteredUsers
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            const { name, userName, active } = row;
                                                            const selectedUser = selected.indexOf(userName) !== -1;

                                                            return (
                                                                <TableRow
                                                                    hover
                                                                    key={userName}
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

                                                                    <TableCell padding="none" align="right" width="25%">
                                                                        {(matchesXs || display === userName) && (
                                                                            <UtilityBar
                                                                                singleValue={userName}
                                                                                multipleValues={[userName]}
                                                                                sendMessage
                                                                                favorRequest
                                                                                repayRequest
                                                                                handleRemoveContacts={handleRemoveContacts}
                                                                            ></UtilityBar>
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
                                                                        <strong>{longTextDisplay(filterName, 34)}</strong>
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
                    </SubCard>
                </Grid>
            </Grid>
        );
    }

    return content;
};

export default Contacts;
