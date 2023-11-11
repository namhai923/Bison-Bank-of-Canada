import { Grid, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Loader from 'components/loader/Loader';
import MainCard from 'components/cards/MainCard';
import RepayHistory from './RepayHistory';
import MakeRequestCard from 'components/cards/request-card/MakeRequestCard';
import ResponseCard from 'components/cards/ResponseCard';
import { gridSpacing } from 'assets/data/constant';
import {
    useGetRepayHistoryQuery,
    useGetPendingRepayQuery,
    useMakeRepayRequestMutation,
    useResponseRepayMutation
} from 'app/features/repay/repayApiSlice';
import config from 'assets/data/config';

let Repay = () => {
    let {
        data: repayHistory,
        isLoading: isRepayHistoryLoading,
        isSuccess: isRepayHistorySuccess,
        isError: isRepayHistoryError,
        error: repayHistoryError
    } = useGetRepayHistoryQuery('repayHistory', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let {
        data: pendingRepay,
        isLoading: isPendingRepayLoading,
        isSuccess: isPendingRepaySuccess,
        isError: isPendingRepayError,
        error: pendingRepayError
    } = useGetPendingRepayQuery('pendingRepay', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let [makeRepayRequest] = useMakeRepayRequestMutation();
    let handleMakeRequest = async (values) => {
        toast.promise(
            makeRepayRequest({
                accounts: values['repayRequestEmails'],
                amount: values['repayRequestAmount'],
                description: values['repayRequestDescription']
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Repay request sent 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
    };
    let [responseRepay] = useResponseRepayMutation();
    let handleResponse = async (accepted, id) => {
        toast.promise(
            responseRepay({
                accepted,
                id
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Response repay successfully 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
    };

    let content;
    if (isRepayHistoryLoading || isPendingRepayLoading) content = <Loader />;

    if (isRepayHistoryError || isPendingRepayError) {
        content = (
            <p className="errmsg">
                {repayHistoryError?.data?.message}
                {pendingRepayError?.data?.message}
            </p>
        );
    }
    if (isRepayHistorySuccess && isPendingRepaySuccess) {
        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h3">Repay</Typography>
                    </Paper>
                </Grid>
                {pendingRepay.length !== 0 && (
                    <Grid item xs={12}>
                        <MainCard title="Pending Favor Request">
                            <PerfectScrollbar style={{ maxHeight: '50vh', overflowX: 'hidden' }}>
                                <Grid container spacing={gridSpacing}>
                                    {pendingRepay.map((repay) => {
                                        return (
                                            <Grid item xs={12} sm={6} xl={3}>
                                                <ResponseCard id={repay.repayId} data={repay} handleSubmit={handleResponse} />
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </PerfectScrollbar>
                        </MainCard>
                    </Grid>
                )}
                <Grid item xs={12} lg={5}>
                    <MakeRequestCard title="Make Repay Request" name="repayRequest" handleSubmit={handleMakeRequest} />
                </Grid>
                <Grid item xs={12} lg={7}>
                    <RepayHistory data={repayHistory} />
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Repay;
