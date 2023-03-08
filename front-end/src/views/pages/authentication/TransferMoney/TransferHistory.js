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
//import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpOutlined'
import { createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { KeyboardArrowUpOutlined } from '@mui/icons-material';
import Sidebar from 'layout/MainLayout/Sidebar';
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
    const theme = useTheme();
    var counter = 1;
    function createData(email, sender, reciever, date, amount, id) {
        var color;
        var background;
        var senderOrReciever;
        var otherPerson;
        var upOrDown;
        if (email == sender) {
            senderOrReciever = 'Sent to:';
            otherPerson = reciever;
            upOrDown = KeyboardArrowDownOutlinedIcon;
        } else if (email == reciever) {
            senderOrReciever = 'Received from:';
            otherPerson = sender;
            upOrDown = KeyboardArrowUpOutlined;
        } else {
            senderOrReciever = 'Unknown';
            otherPerson = 'Unknown';
        }

        if (amount <= 10) {
            (color = theme.palette.primary.light), (background = theme.palette.success.dark);
        } else if (amount >= 50) {
            (color = theme.palette.primary.light), (background = theme.palette.error.dark);
        } else {
            (color = theme.palette.primary.light), (background = theme.palette.warning.dark);
        }
        if (amount % 1 == 0) {
            amount = amount + '.00';
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
        amount = '$' + amount;
        //return { transNumber, merchant, date, category, price, color, background };
        return { transNumber, senderOrReciever, otherPerson, date, amount, color, background, KeyboardArrowDownOutlinedIcon, upOrDown };
    }
    const location = useLocation();
    const rows = [];
    const AddData = () => {
        let [transferHistory, setEH] = useState([]);
        useEffect(() => {
            async function getExpenseHistory(email) {
                let expense = await bbcApi.getUser(email);
                setEH(expense.transferHistory);
            }
            if (location.state == null) {
                //getExpenseHistory('elonmusk@twitter.com');
                getExpenseHistory('Jessewu1999@gmail.com');
            } else {
                getExpenseHistory(location.state.name);
            }
        }, []);
        for (let i = 0; i < transferHistory.length; i++) {
            rows.push(
                createData(
                    'Jessewu1999@gmail.com',
                    transferHistory[i].sender,
                    transferHistory[i].receiver,
                    transferHistory[i].date,
                    transferHistory[i].amount,
                    1
                )
            );
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
            <CardContent>
                <Typography component={Link} to="/" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    Back to Dashboard
                </Typography>
                <Typography variant="h2" align="center">
                    You have not made or recieved any transfer so far. Send money to your friends to get started!
                </Typography>
            </CardContent>
        );
    } else {
        return (
            <>
                {isLoading ? (
                    <SkeletonPopularCard />
                ) : (
                    <MainCard content={false}>
                        <CardContent>
                            <TableContainer component={Paper}>
                                <Typography variant="h2" align="center">
                                    Transfer History
                                </Typography>
                                <Table xs={12} aria-label="simple table">
                                    {
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Id</TableCell>
                                                <TableCell align="left"> </TableCell>
                                                <TableCell align="left">Receiver/Recipeint</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    }
                                    <TableBody>
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    {row.transNumber}
                                                </TableCell>
                                                <TableCell align="left">{row.senderOrReciever}</TableCell>
                                                <TableCell align="left">{row.otherPerson}</TableCell>
                                                <TableCell align="left">{row.date}</TableCell>
                                                <TableCell align="left">{row.amount}</TableCell>
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
                                                    <row.upOrDown fontSize="small" color="inherit" />
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
