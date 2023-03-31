// material-ui
import { Grid } from '@mui/material';

// project imports
import AccountBalance from './AccountBalance';
import TotalSpending from './TotalSpending';
import LatestExpense from './LatestExpense';
import LatestTransfer from './LatestTransfer';
import { gridSpacing } from 'store/constant';
import SpendingBarChart from './SpendingBarChart';

const Dashboard = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <AccountBalance />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalSpending />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <LatestExpense />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <LatestTransfer />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12}>
                        <SpendingBarChart />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
