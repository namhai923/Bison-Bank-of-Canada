import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editLocation } from './filterSlice';

import { TextField, Chip, Typography, Modal, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconFilter } from '@tabler/icons';

import CustomSelect from 'ui-component/extended/CustomSelect';
import categories from 'assets/data/categories';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '25px',
    boxShadow: 24,
    p: 4
};

let FilterModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();

    const [location, setLocation] = useState('');
    let [category, setCategory] = useState('');
    let dispatch = useDispatch();

    const getLocations = () => {
        let expenseHistory = userInfo.expenseHistory;
        let list = [];
        for (let i = 0; i < expenseHistory.length; i++) {
            if (!list.includes(expenseHistory[i].location)) list.push(expenseHistory[i].location);
        }
        return list;
    };

    const getCategory = () => {
        let expenseHistory = userInfo.expenseHistory;
        let list = [];
        for (let i = 0; i < expenseHistory.length; i++) {
            if (!list.includes(expenseHistory[i].category)) list.push(expenseHistory[i].category);
        }
        return list;
    };
    let allLocations = getLocations();
    let categories = getCategory();
    const calculateFilter = () => {
        let storeObj = {};
        category !== '' ? (storeObj.category = category) : (storeObj.category = null);
        location !== '' ? (storeObj.location = location) : (storeObj.location = null);

        let a1 = editLocation({ locationInfo: storeObj });
        dispatch(a1);

        setCategory('');
        setLocation('');
    };

    const resetFilter = () => {
        let storeObj = {
            location: null,
            category: null
        };

        let action = editLocation({ locationInfo: storeObj });
        dispatch(action);
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
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <CustomSelect options={categories} />
                    <CustomSelect options={categories} />

                    <Typography id="modal-modal-title" variant="h2" component="h2" align="center">
                        Filter Menu
                    </Typography>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center" style={{ padding: '15px' }}>
                        Location:
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Location</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Age"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                            }}
                        >
                            {allLocations.map(function (loc, index) {
                                return <MenuItem value={loc}>{loc}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center" style={{ padding: '15px' }}>
                        Category:
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                            >
                                {categories.map(function (cat, index) {
                                    return <MenuItem value={cat}>{cat}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={calculateFilter} style={{ margin: '20px' }}>
                            Filter
                        </Button>
                        <Button variant="contained" onClick={resetFilter} style={{ margin: '20px' }}>
                            Reset
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default FilterModal;
