import { Container, Grid } from '@mui/material';

import Typography from 'components/info/Typography';

export default function ProductCategories() {
    return (
        <Container component="section" sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h4" marked="center" align="center" component="h2" sx={{ mb: 4 }}>
                Built with
            </Typography>
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={6} align="center">
                        <a href="https://mui.com/core/" rel="noopener" target="_blank">
                            <img width="150" height="133" src="https://mui.com/static/logo.svg" alt="MUI Core logo" />
                        </a>
                    </Grid>
                    <Grid item xs={12} md={6} align="center">
                        <a href="https://pokeapi.co/" rel="noopener" target="_blank">
                            <img
                                height="133"
                                src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi.svg?sanitize=true"
                                alt="PokeAPI"
                            />
                        </a>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}
