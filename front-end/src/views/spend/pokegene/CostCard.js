import { useTheme } from '@mui/material/styles';
import { Box, Card, Chip, Typography, Stack, TableBody, Table, TableRow, TableCell } from '@mui/material';
import { IconStarFilled } from '@tabler/icons-react';

import TYPES from 'assets/data/pokegene/TYPES';

const CostCard = () => {
    let theme = useTheme();

    return (
        <Card>
            <Table>
                <TableBody>
                    {TYPES.map((type) => (
                        <TableRow>
                            <TableCell sx={{ p: 0 }} align="center">
                                <Chip
                                    size="small"
                                    label={type.label}
                                    sx={{ backgroundColor: `${type.color}`, color: `${theme.palette.background.paper}`, p: 0 }}
                                />
                            </TableCell>
                            <TableCell sx={{ p: 0 }} align="center">
                                <Typography variant="h5"> = </Typography>
                            </TableCell>
                            <TableCell sx={{ p: 1 }} align="center">
                                <Stack direction="row" justifyContent="center">
                                    <Typography variant="subtitle1"> {type.cost} </Typography>
                                    <Box sx={{ display: 'flex', color: `${theme.palette.warning.dark}` }}>
                                        <IconStarFilled stroke={1.5} size="1.3rem" />
                                    </Box>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default CostCard;
