import { Grid } from '@mui/material';

//project imports
import Expense from './Expense';
import Transfer from './Transfer';
import SubCard from 'components/cards/SubCard';
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'assets/data/constant';

let SpendMoney = () => (
    <MainCard title="Spend Money">
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <SubCard title="Make an Expense">
                    <Expense />
                </SubCard>
            </Grid>
            <Grid item xs={12} sm={6}>
                <SubCard title="Make a Transfer">
                    <Transfer />
                </SubCard>
            </Grid>
        </Grid>
    </MainCard>
);

export default SpendMoney;
