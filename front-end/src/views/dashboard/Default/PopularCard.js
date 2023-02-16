import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography, Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { createTheme } from '@mui/material/styles';
import BasicModal from './FilterModal';
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const themeColor = createTheme({
        palette: {
            yellow: {
                light: '#ffa726',
                main: '#f57c00',
                dark: '#FFFF66',
                contrastText: 'rgba(255, 255, 102, 255)'
            },
            contrastThreshold: 3,
            // Used by the functions below to shift a color's luminance by approximately
            // two indexes within its tonal palette.
            // E.g., shift from Red 500 to Red 300 or Red 700.
            tonalOffset: 0.2
        }
    });

    function createData(transNumber, merchant, date, category, price) {
        var color;
        var background;
        if (price <= 10) {
            //(color = theme.palette.success.dark), (background = theme.palette.success.light);
            (color = theme.palette.primary.light), (background = theme.palette.success.dark);
        } else if (price >= 50) {
            (color = theme.palette.primary.light), (background = theme.palette.error.dark);
        } else {
            //(color = theme.palette.success.dark), (background = theme.palette.success.light);
            (color = theme.palette.primary.light), (background = themeColor.palette.yellow.dark);
        }
        if (price % 1 == 0) {
            price = price + '.00';
        }
        price = '$' + price;
        return { transNumber, merchant, date, category, price, color, background };
    }
    const rows = [
        createData(15432765, 'Walmart', 'February 14, 2019', 'Groceries', 5),
        createData(15432434524323, 'Superstore', 'May 14, 29', 'Eye Test', 400000000.06),
        createData(15432434524323, 'Superstore', 'May 14, 29', 'Eye Test', 40.06)
    ];
    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Typography variant="h2" align="center">
                                Tracking Expense
                            </Typography>
                            <BasicModal />
                            <Table xs={12} aria-label="simple table">
                                {
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Transaction #</TableCell>
                                            <TableCell align="left">Merchant</TableCell>
                                            <TableCell align="left">Date</TableCell>
                                            <TableCell align="left">Category</TableCell>
                                            <TableCell align="left">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                }
                                <TableBody>
                                    {rows.map((row) => (
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
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
