import { useState } from 'react';
import PropTypes from 'prop-types';

import { Chip, Modal, Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconFilter } from '@tabler/icons-react';

import FilterForm from 'views/dashboard/history/FilterForm';

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
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={{ ...style, width: matchesXs ? '80%' : 400 }}>
                    <Typography variant="h3">{title}</Typography>
                    <FilterForm data={data} filterData={filterData} />
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
