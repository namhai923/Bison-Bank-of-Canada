import PropTypes from 'prop-types';
import { Box, Card, CardContent, Divider, Stack, Button } from '@mui/material';

const ResponseCard = (props) => {
    const { id, data, handleSubmit } = props;

    return (
        <Card
        // sx={{
        //     display: 'flex',
        //     flexDirection: 'column',
        //     width: 400,
        //     height: '100%'
        // }}
        >
            <CardContent>{`userName: ${data.userName}\namount: ${data.userName}\ndescription: ${data.userName}\ncreatedAt: ${data.createdAt} \nid: ${data.id}`}</CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2} sx={{ p: 2 }}>
                <Button variant="contained" color="error" onClick={() => handleSubmit(false, id)}>
                    Decline
                </Button>
                <Button variant="contained" color="success" onClick={() => handleSubmit(true, id)}>
                    Accept
                </Button>
            </Stack>
        </Card>
    );
};

ResponseCard.propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    handleSubmit: PropTypes.func
};

export default ResponseCard;
