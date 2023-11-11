import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Chip, Modal, Box, Typography, Tooltip, IconButton, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconFilter, IconFilterCancel } from '@tabler/icons-react';

import FilterForm from 'components/filter/FilterForm';
import { setFilter } from 'app/features/filter/filterSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '27px',
    boxShadow: 24,
    p: 4
};

let FilterModal = (props) => {
    const theme = useTheme();
    let { title, data, filterData } = props;
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const formikRef = useRef();
    const selectRef = useRef();
    let resetValues = {};
    filterData.forEach((filterValue) => {
        if (filterValue.type === 'emails') {
            resetValues[filterValue.name] = [];
        } else if (filterValue.type === 'date') {
            resetValues[`${filterValue.name}From`] = null;
            resetValues[`${filterValue.name}To`] = null;
        } else if (filterValue.type === 'amount') {
            resetValues[`${filterValue.name}From`] = '';
            resetValues[`${filterValue.name}To`] = '';
        }
    });

    let dispatch = useDispatch();
    let handleClearFilter = () => {
        formikRef.current?.resetForm({
            values: {
                ...resetValues
            }
        });
        selectRef?.current?.clearValue();
        Object.entries(resetValues).forEach(([key, value]) => {
            dispatch(setFilter({ type: key, value }));
        });
    };

    return (
        <>
            <Chip
                label="Filter"
                icon={<IconFilter />}
                sx={{
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.light,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light
                    }
                }}
                variant="outlined"
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleOpen}
                color="primary"
            />
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: matchesXs ? '80%' : 600 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h3">{title}</Typography>
                        <Tooltip title="Clear filter">
                            <IconButton onClick={handleClearFilter}>
                                <IconFilterCancel stroke={1.5} size="1.3rem" color={theme.palette.error.dark} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <FilterForm data={data} filterData={filterData} formikRef={formikRef} selectRef={selectRef} />
                </Box>
            </Modal>
        </>
    );
};

FilterModal.propTypes = {
    title: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object)
};

export default FilterModal;
