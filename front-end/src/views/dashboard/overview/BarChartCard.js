import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
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

    let chartData = barChartData(createChartData(favorHistory, debtHistory));

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
                        <Chart {...chartData} />
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
