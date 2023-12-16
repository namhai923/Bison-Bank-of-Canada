import { Button, Box, Grid, Container, Stack } from '@mui/material';
import { IconSend, IconStar, IconPokeball, IconArrowsLeftRight } from '@tabler/icons-react';

import Typography from 'components/info/Typography';

const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5
};

const number = {
    fontSize: 24,
    fontFamily: 'default',
    color: 'secondary.main',
    fontWeight: 'medium'
};

function ProductHowItWorks() {
    return (
        <Box component="section" sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}>
            <Container
                sx={{
                    mt: 10,
                    mb: 15,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
                    How it works
                </Typography>
                <div>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={3}>
                            <Box sx={item}>
                                <Stack direction="row" alignItems="center">
                                    <Box sx={number}>1.</Box>
                                    <IconSend></IconSend>
                                </Stack>
                                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                    Send Favor Request:
                                </Typography>
                                <Typography variant="h5" align="center">
                                    Begin by sending a favor request to a friend or community member. Specify the task or assistance you
                                    need, whether it's borrowing a book, getting a ride, or any other favor
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={item}>
                                <Stack direction="row" alignItems="center">
                                    <Box sx={number}>2.</Box>
                                    <IconStar></IconStar>
                                </Stack>
                                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                    Earn Credit Points:
                                </Typography>
                                <Typography variant="h5" align="center">
                                    Once your favor request is accepted, you earn credit points as a token of appreciation. These points
                                    symbolize the gratitude within the community and can be used for various purposes
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={item}>
                                <Stack direction="row" alignItems="center">
                                    <Box sx={number}>3.</Box>
                                    <IconPokeball></IconPokeball>
                                </Stack>
                                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                    Catch Pokémon:
                                </Typography>
                                <Typography variant="h5" align="center">
                                    Utilize your accumulated credit points in an exciting way—by catching Pokémon within the app! Each
                                    Pokémon represents a unique reward or bonus, adding an element of fun and surprise to your gratitude
                                    journey
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={item}>
                                <Stack direction="row" alignItems="center">
                                    <Box sx={number}>4.</Box>
                                    <IconArrowsLeftRight></IconArrowsLeftRight>
                                </Stack>
                                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                    Trade Pokémon:
                                </Typography>
                                <Typography variant="h5" align="center">
                                    Strengthen your social bonds by trading Pokémon with friends. This feature not only adds a collaborative
                                    aspect to the app but also encourages a sense of camaraderie as you share your collected treasures
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <Button color="secondary" size="large" variant="contained" component="a" href="/" sx={{ mt: 8 }}>
                    Get started
                </Button>
            </Container>
        </Box>
    );
}

export default ProductHowItWorks;
