import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Typography, Table, TablePagination } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as React from 'react';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import bbcApi from 'api/bbcApi';
// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { createTheme } from '@mui/material/styles';
import BasicModal from './FilterModal';
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
    const theme = useTheme();
    var counter = 1;
    function createData(merchant, date, category, price) {
        var color;
        var background;
        if (price <= 10) {
            (color = theme.palette.primary.light), (background = theme.palette.success.dark);
        } else if (price >= 50) {
            (color = theme.palette.primary.light), (background = theme.palette.error.dark);
        } else {
            (color = theme.palette.primary.light), (background = theme.palette.warning.dark);
        }
        if (price % 1 == 0) {
            price = price + '.00';
        }
        const dateArray = date.split('-');
        console.assert(dateArray.length == 3);
        dateArray[2] = dateArray[2].split('T')[0];
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        date = months[Number(dateArray[1] - 1)] + ' ' + dateArray[2] + ', ' + dateArray[0];
        const transNumber = counter;
        counter = counter + 1;
        price = '$' + price;
        return { transNumber, merchant, date, category, price, color, background };
    }
    const location = useLocation();
    const rows = [];
    const AddData = () => {
        let [expenseHistory, setEH] = useState([]);
        useEffect(() => {
            async function getExpenseHistory(email) {
                let expense = await bbcApi.getUser(email);
                setEH(expense.expenseHistory);
            }
            if (location.state == null) {
                getExpenseHistory('elonmusk@twitter.com');
            } else {
                getExpenseHistory(location.state.name);
            }
        }, []);
        for (let i = 0; i < expenseHistory.length; i++) {
            rows.push(createData(expenseHistory[i].location, expenseHistory[i].date, expenseHistory[i].category, expenseHistory[i].amount));
        }
    };
    AddData();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    if (rows.length == 0) {
        return (
            <Typography variant="h2" align="center">
                Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here
            </Typography>
        );
    } else {
        return (
            <>
                {isLoading ? (
                    <SkeletonPopularCard />
                ) : (
                    <MainCard content={false}>
                        <CardContent>
                            <BasicModal />
                            <TableContainer component={Paper}>
                                <Typography variant="h2" align="center">
                                    Tracking Expense
                                </Typography>
                                <Table xs={12} aria-label="simple table">
                                    {
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Transaction Id</TableCell>
                                                <TableCell align="left">Merchant</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Category</TableCell>
                                                <TableCell align="left">Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    }
                                    <TableBody>
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    {row.transNumber}
                                                </TableCell>
                                                <TableCell align="left">{row.merchant}</TableCell>
                                                <TableCell align="left">{row.date}</TableCell>
                                                <TableCell align="left">{row.category}</TableCell>
                                                <TableCell align="left">{row.price}</TableCell>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: '5px',
                                                        backgroundColor: row.background,
                                                        color: row.color,
                                                        ml: 2
                                                    }}
                                                >
                                                    <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                                </Avatar>
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
                        </CardContent>
                        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                            <Button size="small" disableElevation>
                                View All
                                <ChevronRightOutlinedIcon />
                            </Button>
                        </CardActions>
                    </MainCard>
                )}
            </>
        );
    }
    PopularCard.propTypes = {
        isLoading: PropTypes.bool
    };
};
export default PopularCard;
