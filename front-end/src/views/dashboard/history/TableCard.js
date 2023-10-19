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
    tooltipClasses,
    Zoom
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconDots } from '@tabler/icons-react';

import MainCard from 'components/cards/MainCard';
import FilterModal from './FilterModal';
import Label from 'components/label';
import { months } from 'assets/data/timeDisplay';
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

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        fontSize: 15
    }
}));

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
    let { title, headLabels, data, displayData, filterData, emptyMessage, emptyFilterMessage } = props;

    let theme = useTheme();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

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
                    <PerfectScrollbar>
                        <TableContainer component={Paper} sx={{ minWidth: 500 }}>
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
                                                            let date = new Date(displayValue);
                                                            displayValue =
                                                                months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
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
                                                        }

                                                        return (
                                                            <TableCell align={headLabel.alignRight ? 'right' : 'left'}>
                                                                {displayValue}
                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell padding="none" align="right" width="20%">
                                                                <LightTooltip
                                                                    title={row.description || 'No Description'}
                                                                    placement="left-start"
                                                                    TransitionComponent={Zoom}
                                                                >
                                                                    <IconButton>
                                                                        <IconDots stroke={1.5} size="1.3rem" />
                                                                    </IconButton>
                                                                </LightTooltip>
                                                            </TableCell>
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
    );
};

TableCard.propTypes = {
    title: PropTypes.string,
    headLabels: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    displayData: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object),
    emptyMessage: PropTypes.string,
    emptyFilterMessage: PropTypes.string
};

export default TableCard;
