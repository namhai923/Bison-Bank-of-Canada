import { Grid, Stack, Paper, Typography } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { toast } from 'react-toastify';

import Loader from 'components/Loader';
import RepayHistory from './RepayHistory';
import MakeRequestCard from '../MakeRequestCard';
import ResponseCard from '../ResponseCard';
import { gridSpacing } from 'assets/data/constant';
import {
    useGetRepayHistoryQuery,
    useGetPendingRepayQuery,
    useMakeRepayRequestMutation,
    useResponseRepayMutation
} from 'app/features/user/userApiSlice';
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
                accounts: values.emails,
                amount: values.amount,
                description: values.description
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
                <Grid item xs={12} sm={6}>
                    <MakeRequestCard title="Make Repay Request" handleSubmit={handleMakeRequest} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <RepayHistory data={repayHistory} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <PerfectScrollbar>
                        <Stack>
                            {pendingRepay.map((repay) => {
                                return <ResponseCard id={repay.repayId} data={repay} handleSubmit={handleResponse}></ResponseCard>;
                            })}
                        </Stack>
                    </PerfectScrollbar>
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Repay;
