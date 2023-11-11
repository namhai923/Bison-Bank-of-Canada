import PropTypes from 'prop-types';

import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

import { fNumber } from 'utils/formatNumber';
import useChart from 'components/chart/useChart';
import MainCard from 'components/cards/MainCard';

const CHART_HEIGHT = 310;
const LEGEND_HEIGHT = 40;

const StyledChartWrapper = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible'
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
    }
}));

const CardWrapper = styled(MainCard)(({ color }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${color} -50.94%, rgba(144, 202, 249, 0) 93.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${color} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const PieChartCard = (props) => {
    let { title, chartColors, chartData, color, totalLabel } = props;
    const theme = useTheme();

    let displayData = [...chartData.summary];

    displayData = displayData
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map((account) => ({ label: account.userName, value: account.amount }));

    displayData.push({
        label: 'others',
        value: chartData.total - displayData.reduce((total, current) => total + current.value, 0)
    });

    const chartLabels = displayData.map((i) => i.label);

    const chartSeries = displayData.map((i) => i.value);

    const chartOptions = useChart(
        {
            colors: chartColors,
            labels: chartLabels,
            stroke: { colors: [theme.palette.background.paper] },
            legend: { floating: true, horizontalAlign: 'center' },
            dataLabels: { enabled: true, dropShadow: { enabled: false } },
            tooltip: {
                enabled: false,
                fillSeriesColor: false,
                y: {
                    formatter: (seriesName) => fNumber(seriesName),
                    title: {
                        formatter: (seriesName) => `${seriesName}`
                    }
                }
            },
            plotOptions: {
                pie: { donut: { labels: { show: true } } }
            }
        },
        totalLabel
    );

    return (
        <CardWrapper color={color}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid item>
                        <Typography variant="h3">{title}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <StyledChartWrapper dir="ltr">
                        <ReactApexChart type="donut" series={chartSeries} options={chartOptions} height={280} />
                    </StyledChartWrapper>
                </Grid>
            </Grid>
        </CardWrapper>
    );
};

PieChartCard.propTypes = {
    title: PropTypes.string,
    chartColors: PropTypes.arrayOf(PropTypes.string),
    chartData: PropTypes.object,
    color: PropTypes.string,
    totalLabel: PropTypes.string
};

export default PieChartCard;
