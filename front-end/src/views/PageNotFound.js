import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

import notFound from 'assets/images/Bison-Tongue-Out.gif';
import { openMenu } from 'app/features/customize/customizeSlice';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

let PageNotFound = () => {
    let dispatch = useDispatch();
    let handleClick = () => {
        let action = openMenu('');
        dispatch(action);
    };

    return (
        <Container>
            <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                <Typography variant="h3" paragraph>
                    Sorry, page not found!
                </Typography>

                <Box component="img" src={notFound} sx={{ height: 400, my: { xs: 5, sm: 5 } }} />
                <Button to="/info" size="large" variant="contained" component={RouterLink} onClick={handleClick}>
                    Go to Home
                </Button>
            </StyledContent>
        </Container>
    );
};

export default PageNotFound;
