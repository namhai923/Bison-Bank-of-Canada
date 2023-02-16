import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import MaterialUIPickers from './MaterialUIPickers';

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

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h2" component="h2" align="center">
                        Filter Menu
                    </Typography>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center" style={{ padding: '15px' }}>
                        Location:
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField hiddenLabel id="filled-hidden-label-small" defaultValue="Superstore" variant="filled" size="small" />
                    </div>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center" style={{ padding: '15px' }}>
                        Category:
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField hiddenLabel id="filled-hidden-label-small" defaultValue="" variant="filled" size="small" />
                    </div>
                    <Typography variant="h3" id="modal-modal-description" sx={{ mt: 2 }} align="center">
                        Date: <MaterialUIPickers newLabel="From" />
                        <MaterialUIPickers newLabel="To" />
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" style={{ margin: '20px' }}>
                            Filter
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
