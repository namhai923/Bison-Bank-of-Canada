import { Paper, Grid, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import MainCard from 'components/cards/MainCard';
import DebtHistory from './DebtHistory';
import DebtSummary from './DebtSummary';
import ResponseCard from 'components/cards/ResponseCard';
import { gridSpacing } from 'assets/data/constant';
import { useGetPendingFavorQuery, useResponseFavorMutation } from 'app/features/favor/favorApiSlice';
import { useGetDebtSummaryQuery, useGetDebtHistoryQuery } from 'app/features/debt/debtApiSlice';
import config from 'assets/data/config';

const Debt = () => {
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

    let {
        data: pendingFavor,
        isLoading: isPendingFavorLoading,
        isSuccess: isPendingFavorSuccess,
        isError: isPendingFavorError,
        error: pendingFavorError
    } = useGetPendingFavorQuery('pendingFavor', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let [responseFavor] = useResponseFavorMutation();
    let handleSubmit = async (accepted, id) => {
        toast.promise(
            responseFavor({
                accepted,
                id
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Response favor successfully 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
    };

    let content;
    if (isDebtSummaryLoading || isDebtHistoryLoading || isPendingFavorLoading) content = <Loader />;

    if (isDebtSummaryError || isDebtHistoryError || isPendingFavorError) {
        content = (
            <p className="errmsg">
                {debtSummaryError?.data?.message}
                {debtHistoryError?.data?.message}
                {pendingFavorError?.data?.message}
            </p>
        );
    }
    if (isDebtSummarySuccess && isDebtHistorySuccess && isPendingFavorSuccess) {
        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h3">Debt</Typography>
                    </Paper>
                </Grid>
                {pendingFavor.length !== 0 && (
                    <Grid item xs={12}>
                        <MainCard title="Pending Favor Request">
                            <PerfectScrollbar style={{ maxHeight: '50vh', overflowX: 'hidden' }}>
                                <Grid container spacing={gridSpacing}>
                                    {pendingFavor.map((favor) => {
                                        return (
                                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                                <ResponseCard id={favor.favorId} data={favor} handleSubmit={handleSubmit} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </PerfectScrollbar>
                        </MainCard>
                    </Grid>
                )}
                <Grid item xs={12} lg={5}>
                    <DebtSummary data={debtSummary} />
                </Grid>
                <Grid item xs={12} lg={7}>
                    <DebtHistory data={debtHistory} />
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Debt;
