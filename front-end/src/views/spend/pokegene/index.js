import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Grid, Paper, Typography } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { gridSpacing } from 'assets/data/constant';
import Loader from 'components/loader/Loader';
import MainCard from 'components/cards/MainCard';
import GeneratorCard from './GeneratorCard';
import CostDrawer from './CostDrawer';
import CollectionCard from './CollectionCard';
import config from 'assets/data/config';
import { useGetPokeCollectionQuery } from 'app/features/pokegene/pokeApiSlice';
import { setCost } from 'app/features/customize/customizeSlice';

const Pokegene = () => {
    let theme = useTheme();
    let {
        data: pokeCollection,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPokeCollectionQuery('pokeCollection', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let dispatch = useDispatch();

    let costOpened = useSelector((state) => state.customization.costOpened);

    const handleCostToggle = () => {
        let action = setCost(!costOpened);
        dispatch(action);
    };

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        content = (
            <>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h3">Pokegene</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <GeneratorCard costOpened={costOpened} costToggle={handleCostToggle}></GeneratorCard>
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <MainCard title="Collection">
                            {pokeCollection.length === 0 ? (
                                <Typography align="center" variant="h2" color={theme.palette.grey[300]}>
                                    You have no Pokemon in your collection
                                </Typography>
                            ) : (
                                <PerfectScrollbar style={{ maxHeight: '75vh', overflowX: 'hidden' }}>
                                    <Grid container spacing={gridSpacing}>
                                        {pokeCollection.map(({ _id, pokemon }) => (
                                            <Grid item xs={12} sm={6} xl={3}>
                                                <CollectionCard itemId={_id} pokemon={pokemon} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </PerfectScrollbar>
                            )}
                        </MainCard>
                    </Grid>
                </Grid>
                <CostDrawer costOpened={costOpened} costToggle={handleCostToggle} />
            </>
        );
    }
    return content;
};

export default Pokegene;
