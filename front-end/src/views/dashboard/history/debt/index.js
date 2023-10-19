import { Paper, Grid, Stack, Typography } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { toast } from 'react-toastify';

import Loader from 'components/Loader';
import DebtHistory from './DebtHistory';
import DebtSummary from './DebtSummary';
import ResponseCard from '../ResponseCard';
import { gridSpacing } from 'assets/data/constant';
import {
    useGetDebtSummaryQuery,
    useGetDebtHistoryQuery,
    useGetPendingFavorQuery,
    useResponseFavorMutation
} from 'app/features/user/userApiSlice';
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
                <Grid item xs={12}>
                    <PerfectScrollbar>
                        <Stack direction={'row'}>
                            {pendingFavor.map((favor) => {
                                return <ResponseCard id={favor.favorId} data={favor} handleSubmit={handleSubmit}></ResponseCard>;
                            })}
                        </Stack>
                    </PerfectScrollbar>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DebtHistory data={debtHistory} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DebtSummary data={debtSummary} />
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Debt;
