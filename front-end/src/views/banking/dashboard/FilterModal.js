import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editLocation } from './filterSlice';

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

export default function BasicModal() {
    let userInfo = useSelector((state) => state.user);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
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
        <div>
            {/*<Button onClick={handleOpen}>Open modal</Button>*/}
            <Button variant="contained" onClick={handleOpen} style={{ margin: '20px' }}>
                Filter
            </Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
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
        </div>
    );
}
