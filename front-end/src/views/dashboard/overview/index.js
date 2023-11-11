// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import Loader from 'components/loader/Loader';
import LineChartCard from './LineChartCard';
import PieChartCard from './PieChartCard';
import { gridSpacing } from 'assets/data/constant';
import BarChartCard from './BarChartCard';
import { useGetFavorSummaryQuery, useGetFavorHistoryQuery } from 'app/features/favor/favorApiSlice';
import { useGetDebtSummaryQuery, useGetDebtHistoryQuery } from 'app/features/debt/debtApiSlice';
import config from 'assets/data/config';

const Overview = () => {
    let theme = useTheme();

    let {
        data: favorSummary,
        isLoading: isFavorSummaryLoading,
        isSuccess: isFavorSummarySuccess,
        isError: isFavorSummaryError,
        error: favorSummaryError
    } = useGetFavorSummaryQuery('favorSummary', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let {
        data: debtSummary,
        isLoading: isDebtSummaryLoading,
        isSuccess: isDebtSummarySuccess,
        isError: isDebtSummaryError,
        error: debtSummaryError
    } = useGetDebtSummaryQuery('debtSummary', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let {
        data: favorHistory,
        isLoading: isFavorHistoryLoading,
        isSuccess: isFavorHistorySuccess,
        isError: isFavorHistoryError,
        error: favorHistoryError
    } = useGetFavorHistoryQuery('favorHistory', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let {
        data: debtHistory,
        isLoading: isDebtHistoryLoading,
        isSuccess: isDebtHistorySuccess,
        isError: isDebtHistoryError,
        error: debtHistoryError
    } = useGetDebtHistoryQuery('debtHistory', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;
    if (isFavorSummaryLoading || isDebtSummaryLoading || isFavorHistoryLoading || isDebtHistoryLoading) content = <Loader />;

    if (isFavorSummaryError || isDebtSummaryError || isFavorHistoryError || isDebtHistoryError) {
        content = (
            <p className="errmsg">
                {favorSummaryError?.data?.message}
                {debtSummaryError?.data?.message}
                {favorHistoryError?.data?.message}
                {debtHistoryError?.data?.message}
            </p>
        );
    }
    if (isFavorSummarySuccess && isDebtSummarySuccess && isFavorHistorySuccess && isDebtHistorySuccess)
        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} xl={9}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6}>
                            <LineChartCard
                                data={favorHistory.filter((favor) => favor.accepted)}
                                color="primary"
                                label="Favor"
                                route="/credit/favor"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LineChartCard data={debtHistory} color="secondary" label="Debt" route="/credit/debt" />
                        </Grid>

                        <Grid item xs={12}>
                            <BarChartCard favorHistory={favorHistory.filter((favor) => favor.accepted)} debtHistory={debtHistory} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} xl={3}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} sm={6} xl={12}>
                            <PieChartCard
                                color={theme.palette.primary.dark}
                                title="Current Favors"
                                chartData={favorSummary}
                                chartColors={[
                                    theme.palette.primary.main,
                                    theme.palette.error.main,
                                    theme.palette.success.main,
                                    theme.palette.secondary.main
                                ]}
                                totalLabel="Total Favor"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} xl={12}>
                            <PieChartCard
                                color={theme.palette.secondary.dark}
                                title="Current Debts"
                                chartData={debtSummary}
                                chartColors={[
                                    theme.palette.primary.main,
                                    theme.palette.error.main,
                                    theme.palette.success.main,
                                    theme.palette.secondary.main
                                ]}
                                totalLabel="Total Debt"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    return content;
};

export default Overview;
