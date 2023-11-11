import { styled } from '@mui/material/styles';
import { Button, Box, Container } from '@mui/material';
import { IconArrowBigDownFilled } from '@tabler/icons-react';

import Typography from 'components/info/Typography';
import infoBackground from 'assets/images/info-background.png';

const ProductHeroRoot = styled('section')(({ theme }) => ({
    color: theme.palette.common.white,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        height: '80vh',
        minHeight: 500,
        maxHeight: 1300
    }
}));

const Background = styled(Box)({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2
});

function ProductHero() {
    return (
        <ProductHeroRoot>
            <Container
                sx={{
                    mt: 3,
                    mb: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <img style={{ display: 'none' }} src={infoBackground} alt="increase priority" />
                <Typography color="inherit" align="center" variant="h2" marked="center">
                    Bison Bank of Canada
                </Typography>

                <Typography color="inherit" align="center" variant="h3" sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}>
                    Welcome to BBC, where favors flourish, debts are effortlessly managed, and repayments become celebrations of connection.
                    Join us in creating a world where acts of kindness flow seamlessly, debts are bridges, and gratitude is the currency
                    that strengthens our community.
                </Typography>
                <Button color="secondary" variant="contained" size="large" component="a" href="/" sx={{ minWidth: 200 }}>
                    go to app
                </Button>
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: 'common.black',
                        opacity: 0.5,
                        zIndex: -1
                    }}
                />
                <Background
                    sx={{
                        backgroundImage: `url(${infoBackground})`,
                        backgroundPosition: 'center'
                    }}
                />
                <Box sx={{ position: 'absolute', bottom: 32 }}>
                    <IconArrowBigDownFilled></IconArrowBigDownFilled>
                </Box>
            </Container>
        </ProductHeroRoot>
    );
}

export default ProductHero;
