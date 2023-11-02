import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'assets/data/constant';
import barChartData from 'components/chart/barChartData';
import timeFilter from 'utils/timeFilter';

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

const BarChartCard = (props) => {
    let { favorHistory, debtHistory } = props;
    const theme = useTheme();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;

    useEffect(() => {
        const newChartData = {
            ...barChartData(createChartData(favorHistory, debtHistory)).options,
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
    }, [primaryDark, secondaryMain, primary, darkLight, grey200, grey500, favorHistory, debtHistory]);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid item>
                            <Typography variant="h3">{new Date().getFullYear()}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Chart {...barChartData(createChartData(favorHistory, debtHistory))} />
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

BarChartCard.propTypes = {
    favorHistory: PropTypes.arrayOf(PropTypes.object),
    debtHistory: PropTypes.arrayOf(PropTypes.object)
};

export default BarChartCard;
