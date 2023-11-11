import { useState } from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Typography,
    Table,
    TablePagination,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Tooltip,
    IconButton,
    Popover
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconDots } from '@tabler/icons-react';
import moment from 'moment/moment';

import MainCard from 'components/cards/MainCard';
import FilterModal from '../filter/FilterModal';
import Label from 'components/label';
import { fCurrency } from 'utils/formatNumber';

const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    clip: 'rect(0 0 0 0)'
};

function descendingComparator(a, b, orderBy) {
    let compareA = a[orderBy] ?? 0;
    let compareB = b[orderBy] ?? 0;
    if (orderBy === 'date') {
        compareA = new Date(compareA);
        compareB = new Date(compareB);
    }
    if (compareB < compareA) {
        return -1;
    }
    if (compareB > compareA) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const TableCard = (props) => {
    let { title, headLabels, data, displayData, filterData, emptyMessage, emptyFilterMessage, tableMinWidth } = props;

    let theme = useTheme();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const [open, setOpen] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (event) => {
        const isAsc = orderBy === event && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(event);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const sortedDisplayData = applySort(displayData, getComparator(order, orderBy));

    return (
        <>
            <MainCard title={title} secondary={<FilterModal title={title} data={data} filterData={filterData} />}>
                {displayData.length === 0 ? (
                    <>
                        {data.length === 0 ? (
                            <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                                {emptyMessage}
                            </Typography>
                        ) : (
                            <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                                {emptyFilterMessage}
                            </Typography>
                        )}
                    </>
                ) : (
                    <>
                        <PerfectScrollbar style={{ maxWidth: 'auto', maxHeight: '50vh', overflowX: 'hidden' }}>
                            <TableContainer component={Paper} sx={{ minWidth: tableMinWidth }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {headLabels.map((headLabel) => {
                                                return (
                                                    <TableCell
                                                        key={headLabel.id}
                                                        align={headLabel.alignRight ? 'right' : 'left'}
                                                        sortDirection={orderBy === headLabel.id ? order : false}
                                                    >
                                                        <TableSortLabel
                                                            hideSortIcon
                                                            active={orderBy === headLabel.id}
                                                            direction={orderBy === headLabel.id ? order : 'asc'}
                                                            onClick={() => handleRequestSort(headLabel.id)}
                                                        >
                                                            {headLabel.label}
                                                            {orderBy === headLabel.id ? (
                                                                <Box sx={{ ...visuallyHidden }}>
                                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                </Box>
                                                            ) : null}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedDisplayData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    {headLabels.map((headLabel) => {
                                                        let displayValue;
                                                        if (headLabel.id !== '') {
                                                            displayValue = row[headLabel.id];
                                                            if (headLabel.id === 'amount') {
                                                                displayValue = fCurrency(displayValue.toString());
                                                            } else if (headLabel.id === 'createdAt') {
                                                                displayValue = moment(displayValue).format('MMMM D, Y');
                                                            } else if (headLabel.id === 'accepted') {
                                                                displayValue = (
                                                                    <Label
                                                                        color={
                                                                            displayValue === undefined
                                                                                ? 'warning'
                                                                                : displayValue
                                                                                ? 'success'
                                                                                : 'error'
                                                                        }
                                                                    >
                                                                        {displayValue === undefined
                                                                            ? 'Pending'
                                                                            : displayValue
                                                                            ? 'Accepted'
                                                                            : 'Declined'}
                                                                    </Label>
                                                                );
                                                            } else if (headLabel.id === 'send') {
                                                                displayValue = displayValue ? 'Send to' : 'Receive from';
                                                            }

                                                            return (
                                                                <TableCell align={headLabel.alignRight ? 'right' : 'left'}>
                                                                    {displayValue}
                                                                </TableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <>
                                                                    <TableCell padding="none" align="right" width="20%">
                                                                        <Tooltip title="Show description">
                                                                            <IconButton
                                                                                onClick={(event) => {
                                                                                    setPopoverContent(row.description);
                                                                                    setOpen(event.currentTarget);
                                                                                }}
                                                                            >
                                                                                <IconDots stroke={1.5} size="1.3rem" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </>
                                                            );
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </PerfectScrollbar>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </MainCard>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75
                        }
                    }
                }}
            >
                {popoverContent || 'No Description'}
            </Popover>
        </>
    );
};

TableCard.propTypes = {
    title: PropTypes.string,
    headLabels: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    displayData: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object),
    emptyMessage: PropTypes.string,
    emptyFilterMessage: PropTypes.string,
    tableMinWidth: PropTypes.number
};

export default TableCard;
