import { useState, useEffect } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import lineChartData from 'views/banking/dashboard/chart-data/lineChartData';
import months from 'assets/data/months';

// assets
import { LocalMallOutlined, Payment } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import filterAmountByTime from 'utils/filterAmountByTime';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

let createChartData = (type, lineData) => {
    let chartData = {};
    let compareDate = new Date();

    chartData.data = filterAmountByTime('year', compareDate, lineData);
    chartData.min = Math.floor(Math.min(...chartData.data));
    chartData.max = Math.ceil(Math.max(...chartData.data));
    if (type === 'month') {
        chartData.data = filterAmountByTime('month', compareDate, lineData);
        chartData.name = months[compareDate.getMonth()];
    } else {
        chartData.name = compareDate.getFullYear();
    }
    return chartData;
};

const TotalSpending = () => {
    const theme = useTheme();
    let userInfo = useSelector((state) => state.user);

    let [chartData, setChartData] = useState(() => {
        let sendTransfer = userInfo.transferHistory.filter((transfer) => transfer.sender === userInfo.userName);
        let totalSpending = userInfo.expenseHistory.concat(sendTransfer);
        return createChartData('year', totalSpending);
    });

    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    useEffect(() => {
        let newChartData = {};
        let sendTransfer = userInfo.transferHistory.filter((transfer) => transfer.sender === userInfo.userName);
        let totalSpending = userInfo.expenseHistory.concat(sendTransfer);
        if (timeValue) {
            newChartData = createChartData('month', totalSpending);
        } else {
            newChartData = createChartData('year', totalSpending);
        }
        setChartData(newChartData);
    }, [timeValue, userInfo]);

    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2.25 }}>
                    <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.primary[800],
                                            color: '#fff',
                                            mt: 1
                                        }}
                                    >
                                        <LocalMallOutlined fontSize="inherit" />
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <Button
                                        disableElevation
                                        variant={timeValue ? 'contained' : 'text'}
                                        size="small"
                                        sx={{ color: 'inherit' }}
                                        onClick={(e) => handleChangeTime(e, true)}
                                    >
                                        Month
                                    </Button>
                                    <Button
                                        disableElevation
                                        variant={!timeValue ? 'contained' : 'text'}
                                        size="small"
                                        sx={{ color: 'inherit' }}
                                        onClick={(e) => handleChangeTime(e, false)}
                                    >
                                        Year
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ mb: 0.75 }}>
                            <Grid container alignItems="center">
                                <Grid item xs={6}>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                $
                                                {chartData.data
                                                    .reduce((total, current) => {
                                                        return total + current;
                                                    }, 0)
                                                    .toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Avatar
                                                sx={{
                                                    ...theme.typography.smallAvatar,
                                                    cursor: 'pointer',
                                                    backgroundColor: theme.palette.primary[200],
                                                    color: theme.palette.primary.dark
                                                }}
                                            >
                                                <Payment fontSize="inherit" />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                    color: theme.palette.primary[200]
                                                }}
                                            >
                                                Total Spending
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    {timeValue ? <Chart {...lineChartData(chartData)} /> : <Chart {...lineChartData(chartData)} />}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </CardWrapper>
        </>
    );
};

export default TotalSpending;
