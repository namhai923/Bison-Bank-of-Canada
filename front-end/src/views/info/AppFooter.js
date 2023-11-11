import { Link, Grid, Container } from '@mui/material';

import Typography from 'components/info/Typography';

function Copyright() {
    return (
        <>
            {'© '}
            <Link color="inherit" target="_blank" rel="noopener" href="https://www.linkedin.com/in/akias/">
                Hai Nguyen
            </Link>{' '}
            {new Date().getFullYear()}
        </>
    );
}

export default function AppFooter() {
    return (
        <Typography component="footer" sx={{ display: 'flex', bgcolor: 'secondary.light' }}>
            <Container sx={{ my: 3, display: 'flex' }}>
                <Grid item>
                    <Copyright />
                </Grid>
            </Container>
        </Typography>
    );
}
