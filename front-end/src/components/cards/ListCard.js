import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Avatar,
    Grid,
    CardContent,
    Typography,
    Table,
    TablePagination,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel
} from '@mui/material';
// project imports
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import FilterModal from 'components/filter/FilterModal';
import months from 'assets/data/months';

// assets
import { gridSpacing } from 'assets/data/constant';

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

const ListCard = (props) => {
    let { labels, rows, emptyMessage, title, filterLabels, filterData } = props;

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
        <MainCard title={title} content={false}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <SubCard>
                        <CardContent>
                            <FilterModal filterLabels={filterLabels} filterData={filterData} />
                            {rows.length === 0 ? (
                                <Typography variant="h2" align="center">
                                    {emptyMessage}
                                </Typography>
                            ) : (
                                <>
                                    <TableContainer component={Paper}>
                                        <Table xs={12} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    {labels.map((label) => {
                                                        if (label === 'Date' || label === 'Amount') {
                                                            return (
                                                                <TableCell
                                                                    key={label}
                                                                    sortDirection={orderBy === label.toLowerCase() ? order : false}
                                                                >
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
                                                                                {order === 'desc'
                                                                                    ? 'sorted descending'
                                                                                    : 'sorted ascending'}
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
                                                {sortedRows
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row, index) => (
                                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                            <TableCell component="th" scope="row">
                                                                {index + 1}
                                                            </TableCell>
                                                            {Object.entries(row.data).map(([key, value]) => {
                                                                if (key === 'amount') {
                                                                    value = '$' + value.toFixed(2);
                                                                } else if (key === 'date') {
                                                                    let date = new Date(value);
                                                                    value =
                                                                        months[date.getMonth()] +
                                                                        ' ' +
                                                                        date.getDate() +
                                                                        ', ' +
                                                                        date.getFullYear();
                                                                }
                                                                return <TableCell align="left">{value}</TableCell>;
                                                            })}
                                                            <TableCell component="th" scope="row">
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '5px',
                                                                        backgroundColor: row.display.background,
                                                                        color: row.display.color,
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <row.display.icon fontSize="small" color="inherit" />
                                                                </Avatar>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
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
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
};

ListCard.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.array,
    emptyMessage: PropTypes.string,
    title: PropTypes.string,
    filterLabels: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object)
};

export default ListCard;
