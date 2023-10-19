import { Grid, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import Loader from 'components/Loader';
import FavorHistory from './FavorHistory';
import FavorSummary from './FavorSummary';
import MakeRequestCard from '../MakeRequestCard';
import { gridSpacing } from 'assets/data/constant';
import { useGetFavorSummaryQuery, useGetFavorHistoryQuery, useMakeFavorRequestMutation } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const Favor = () => {
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

    let [makeFavorRequest] = useMakeFavorRequestMutation();
    let handleSubmit = async (values) => {
        toast.promise(
            makeFavorRequest({
                accounts: values.emails,
                amount: values.amount,
                description: values.description
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Favor request sent 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
    };

    let content;
    if (isFavorSummaryLoading || isFavorHistoryLoading) content = <Loader />;

    if (isFavorSummaryError || isFavorHistoryError) {
        content = (
            <p className="errmsg">
                {favorSummaryError?.data?.message}
                {favorHistoryError?.data?.message}
            </p>
        );
    }
    if (isFavorSummarySuccess && isFavorHistorySuccess) {
        content = (
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h3">Favor</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <MakeRequestCard title="Make Favor Request" handleSubmit={handleSubmit} />
                        </Grid>
                        <Grid item xs={12}>
                            <FavorSummary data={favorSummary} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FavorHistory data={favorHistory} />
                </Grid>
            </Grid>
        );
    }
    return content;
};

export default Favor;
