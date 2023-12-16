import { Box, Grid, Container } from '@mui/material';
import { IconArrowsLeftRight, IconBusinessplan, IconTopologyStar3 } from '@tabler/icons-react';

import Typography from 'components/info/Typography';

const item = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 5
};

function ProductValues() {
    return (
        <Box component="section" sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}>
            <Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <IconArrowsLeftRight></IconArrowsLeftRight>
                            <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                Effortless Reciprocity
                            </Typography>
                            <Typography variant="h5" align="center">
                                Simplifies the process of giving and receiving favors, making it easy for users to engage in acts of
                                kindness without the burden of complicated logistics
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <IconBusinessplan></IconBusinessplan>
                            <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                Debt Management
                            </Typography>
                            <Typography variant="h5" align="center">
                                Provides a user-friendly platform for tracking and managing debts, transforming what could be awkward
                                transactions into seamless interactions. Users can easily navigate and settle debts, fostering a sense of
                                trust and transparency in their relationships
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={item}>
                            <IconTopologyStar3></IconTopologyStar3>
                            <Typography variant="h4" align="center" sx={{ my: 5 }}>
                                Community Building through Gratitude
                            </Typography>
                            <Typography variant="h5" align="center">
                                Cultivates a community where gratitude is the driving force. Users experience the joy of repaying favors and
                                building stronger connections, turning each interaction into a positive and memorable experience
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ProductValues;
