import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');

    const calculateFilter = () => {
        console.log(location);
        console.log(category);
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            defaultValue=""
                            variant="filled"
                            size="small"
                            onChange={(e) => {
                                setLocation(e.target.value);
                            }}
                        />
                    </div>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center" style={{ padding: '15px' }}>
                        Category:
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            defaultValue=""
                            variant="filled"
                            size="small"
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={calculateFilter} style={{ margin: '20px' }}>
                            Filter
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
