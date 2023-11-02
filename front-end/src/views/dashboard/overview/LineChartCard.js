import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography } from '@mui/material';
import { IconArrowRight } from '@tabler/icons-react';
import Chart from 'react-apexcharts';

import MainCard from 'components/cards/MainCard';
import lineChartData from 'components/chart/lineChartData';
import timeFilter from 'utils/timeFilter';
import { fCurrency } from 'utils/formatNumber';

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CardWrapper = styled(MainCard)(({ theme, color }) => ({
    backgroundColor: theme.palette[color].dark,
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
        background: theme.palette[color][800],
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
        background: theme.palette[color][800],
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

    if (type === 'month') {
        chartData.data = timeFilter('month', compareDate, lineData).reverse();
        chartData.name = months[compareDate.getMonth()];
    } else {
        chartData.data = timeFilter('year', compareDate, lineData).reverse();
        chartData.name = compareDate.getFullYear();
    }
    return chartData;
};

const LineChartCard = (props) => {
    const theme = useTheme();
    let navigate = useNavigate();
    let { data, color, label, route } = props;

    let [chartData, setChartData] = useState(createChartData('year', data));

    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    useEffect(() => {
        let newChartData = {};
        if (timeValue) {
            newChartData = createChartData('month', data);
        } else {
            newChartData = createChartData('year', data);
        }
        setChartData(newChartData);
    }, [timeValue, data]);

    return (
        <>
            <CardWrapper border={false} content={false} color={color}>
                <Box sx={{ p: 2.25 }}>
                    <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Button
                                        variant="text"
                                        sx={{ color: 'inherit', '&:hover': { backgroundColor: `${theme.palette[color].main}` } }}
                                        endIcon={<IconArrowRight />}
                                        onClick={() => navigate(route)}
                                    >
                                        details
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        disableElevation
                                        variant={timeValue ? 'contained' : 'text'}
                                        size="small"
                                        sx={{ color: 'inherit' }}
                                        color={color}
                                        onClick={(e) => handleChangeTime(e, true)}
                                    >
                                        Month
                                    </Button>
                                    <Button
                                        disableElevation
                                        variant={!timeValue ? 'contained' : 'text'}
                                        size="small"
                                        sx={{ color: 'inherit' }}
                                        color={color}
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
                                                {fCurrency(
                                                    chartData.data
                                                        .reduce((total, current) => {
                                                            return total + current;
                                                        }, 0)
                                                        .toString()
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                    color: theme.palette[color][200]
                                                }}
                                            >
                                                {label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Chart {...lineChartData(chartData)} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </CardWrapper>
        </>
    );
};

LineChartCard.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    color: PropTypes.string,
    label: PropTypes.string,
    route: PropTypes.string
};

export default LineChartCard;
