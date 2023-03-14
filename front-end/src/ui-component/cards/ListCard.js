import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Avatar, Grid, CardContent, Typography, Table, TablePagination } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

// assets
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { gridSpacing } from 'store/constant';

const ListCard = (props) => {
    let { labels, rows, emptyMessage, title } = props;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <MainCard title={title} content={false}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <SubCard>
                        <CardContent>
                            {rows.length === 0 ? (
                                <Typography variant="h2" align="center">
                                    {emptyMessage}
                                </Typography>
                            ) : (
                                <>
                                    <TableContainer component={Paper}>
                                        <Table xs={12} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    {labels.map((label) => (
                                                        <TableCell>{label}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell component="th" scope="row">
                                                            {row.transNumber}
                                                        </TableCell>
                                                        {Object.values(row.data).map((data) => (
                                                            <TableCell align="left">{data}</TableCell>
                                                        ))}
                                                        <Avatar
                                                            variant="rounded"
                                                            sx={{
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: '5px',
                                                                backgroundColor: row.display.background,
                                                                color: row.display.color,
                                                                ml: 2
                                                            }}
                                                        >
                                                            <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                                        </Avatar>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 100]}
                                        component="div"
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </>
                            )}
                        </CardContent>
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
};

ListCard.propTypes = {
    labels: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.array,
    emptyMessage: PropTypes.string,
    title: PropTypes.string
};

export default ListCard;
