import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'assets/data/constant';
import barChartData from './chart-data/barChartData';
import { filterAmountByTime } from 'utils/timeUtils';

let createChartData = (expense, transfer) => {
    let chartData = {};
    chartData.expense = [];
    chartData.transfer = [];

    for (let i = 0; i < 12; i++) {
        let firstDayOfMonth = new Date(new Date().getFullYear(), i, 1);
        let monthlyExpense = filterAmountByTime('month', firstDayOfMonth, expense);
        let monthlyTransfer = filterAmountByTime('month', firstDayOfMonth, transfer);
        chartData.expense.push(
            monthlyExpense
                .reduce((total, current) => {
                    return total + current;
                }, 0)
                .toFixed(2)
        );
        chartData.transfer.push(
            monthlyTransfer
                .reduce((total, current) => {
                    return total + current;
                }, 0)
                .toFixed(2)
        );
    }
    return chartData;
};

const SpendingBarChart = (props) => {
    let { userName, expenseHistory, transferHistory } = props;
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    let [chartData, setChartData] = useState(() => {
        let sendTransfer = transferHistory.filter((transfer) => transfer.sender === userName);
        return createChartData(expenseHistory, sendTransfer);
    });

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;

    useEffect(() => {
        let newData = {};
        let sendTransfer = transferHistory.filter((transfer) => transfer.sender === userName);
        newData = createChartData(expenseHistory, sendTransfer);
        setChartData(newData);
        const newChartData = {
            ...barChartData(newData).options,
            colors: [primaryDark, secondaryMain],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };
        ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }, [navType, primaryDark, secondaryMain, primary, darkLight, grey200, grey500, userName, transferHistory, expenseHistory]);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Spending Chart</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h3">{new Date().getFullYear()}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Chart {...barChartData(chartData)} />
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

SpendingBarChart.propTypes = {
    userName: PropTypes.string,
    transferHistory: PropTypes.arrayOf(PropTypes.object),
    expenseHistory: PropTypes.arrayOf(PropTypes.object)
};

export default SpendingBarChart;
