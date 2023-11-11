import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'assets/data/constant';
import barChartData from 'components/chart/barChartData';
import timeFilter from 'utils/timeFilter';

// chart data
// import chartData from './chart-data/total-growth-bar-chart';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //
let createChartData = (favor, debt) => {
    let chartData = {};
    chartData.favor = [];
    chartData.debt = [];

    for (let i = 0; i < 12; i++) {
        let firstDayOfMonth = new Date(new Date().getFullYear(), i, 1);
        let monthlyFavor = timeFilter('month', firstDayOfMonth, favor);
        let monthlyDebt = timeFilter('month', firstDayOfMonth, debt);
        chartData.favor.push(
            monthlyFavor
                .reduce((total, current) => {
                    return total + current;
                }, 0)
                .toFixed(2)
        );
        chartData.debt.push(
            monthlyDebt
                .reduce((total, current) => {
                    return total + current;
                }, 0)
                .toFixed(2)
        );
    }
    return chartData;
};

const TotalGrowthBarChart = (props) => {
    let { favorHistory, debtHistory } = props;

    // const [value, setValue] = useState('today');
    const theme = useTheme();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;
    let chartData = barChartData(createChartData(favorHistory, debtHistory));

    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
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

        // do not load chart when loading
        ApexCharts.exec(`bar-chart-haha`, 'updateOptions', newChartData);
    }, [primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, grey500, chartData]);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="subtitle2">Total Growth</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h3">$2,324.00</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                {/* <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                                    {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Chart {...chartData} />
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    favorHistory: PropTypes.arrayOf(PropTypes.object),
    debtHistory: PropTypes.arrayOf(PropTypes.object)
};

export default TotalGrowthBarChart;
