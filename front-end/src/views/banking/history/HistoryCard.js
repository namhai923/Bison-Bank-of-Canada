import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
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
    CardContent
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import Label from 'components/label';
import FilterModal from './FilterModal';
import { months } from 'assets/data/timeDisplay';

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
    let compareA = a.data[orderBy];
    let compareB = b.data[orderBy];
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

function applySortFilter(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const HistoryCard = (props) => {
    let { title, labels, rows, emptyMessage, emptyFilterMessage, filterLabels, filterData } = props;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [orderBy, setOrderBy] = useState('amount');
    const [order, setOrder] = useState('asc');

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

    const sortedRows = applySortFilter(rows, getComparator(order, orderBy));

    return (
        <MainCard title={title}>
            <CardContent>
                {rows.length === 0 ? (
                    <SubCard>
                        <FilterModal filterLabels={filterLabels} filterData={filterData} />
                        {filterData.length === 0 ? (
                            <Typography variant="h2" align="center">
                                {emptyMessage}
                            </Typography>
                        ) : (
                            <Typography variant="h2" align="center">
                                {emptyFilterMessage}
                            </Typography>
                        )}
                    </SubCard>
                ) : (
                    <>
                        <SubCard>
                            <FilterModal filterLabels={filterLabels} filterData={filterData} />
                            <PerfectScrollbar>
                                <TableContainer component={Paper} sx={{ minWidth: 800 }}>
                                    <Table xs={12} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {labels.map((label) => {
                                                    if (label === 'Date' || label === 'Amount') {
                                                        return (
                                                            <TableCell sortDirection={orderBy === label.toLowerCase() ? order : false}>
                                                                <TableSortLabel
                                                                    hideSortIcon
                                                                    active={orderBy === label.toLowerCase()}
                                                                    direction={orderBy === label.toLowerCase() ? order : 'asc'}
                                                                    onClick={() => {
                                                                        handleRequestSort(label.toLowerCase());
                                                                    }}
                                                                >
                                                                    {label}
                                                                    {orderBy === label.toLowerCase() ? (
                                                                        <Box sx={{ ...visuallyHidden }}>
                                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                        </Box>
                                                                    ) : null}
                                                                </TableSortLabel>
                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return <TableCell>{label}</TableCell>;
                                                    }
                                                })}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    {Object.entries(row.data).map(([key, value]) => {
                                                        if (key === 'amount') {
                                                            value = '$' + value.toFixed(2);
                                                        } else if (key === 'date') {
                                                            let date = new Date(value);
                                                            value =
                                                                months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                                                        }
                                                        return <TableCell align="left">{value}</TableCell>;
                                                    })}
                                                    <TableCell component="th" scope="row">
                                                        <Label color={row.display.color}>
                                                            <row.display.icon fontSize="small" color="inherit" />
                                                        </Label>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </PerfectScrollbar>
                        </SubCard>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </CardContent>
        </MainCard>
    );
};

HistoryCard.propTypes = {
    title: PropTypes.string,
    labels: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.array,
    emptyMessage: PropTypes.string,
    emptyFilterMessage: PropTypes.string,
    filterLabels: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object)
};

export default HistoryCard;
