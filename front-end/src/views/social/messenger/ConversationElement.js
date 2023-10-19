import PropTypes from 'prop-types';
import { useState } from 'react';

import { Stack, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { displayTime } from 'utils/timeUtils';

const TextMsg = (props) => {
    let { messageProps } = props;
    const theme = useTheme();
    let [timeDisplay, setTimeDisplay] = useState(null);

    return (
        <Stack
            onMouseEnter={() => setTimeDisplay(messageProps._id)}
            onMouseLeave={() => setTimeDisplay(null)}
            direction="row"
            alignItems={'center'}
            justifyContent={messageProps.sending ? 'end' : 'start'}
        >
            {messageProps.sending && messageProps._id === timeDisplay && (
                <Typography sx={{ fontWeight: 600, paddingRight: '10px' }} variant="caption" color={theme.palette.grey[300]}>
                    {displayTime(new Date(messageProps.createdAt), 'precise')}
                </Typography>
            )}
            <Box
                px={1.5}
                py={1.5}
                sx={{
                    backgroundColor: messageProps.sending ? theme.palette.primary[200] : theme.palette.secondary.light,
                    borderRadius: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    maxWidth: '50%'
                }}
            >
                <Typography variant="body2" color={theme.palette.text}>
                    {messageProps.message}
                </Typography>
            </Box>
            {!messageProps.sending && messageProps._id === timeDisplay && (
                <Typography sx={{ fontWeight: 600, paddingLeft: '10px' }} variant="caption" color={theme.palette.grey[300]}>
                    {displayTime(new Date(messageProps.createdAt), 'precise')}
                </Typography>
            )}
        </Stack>
    );
};

TextMsg.propTypes = {
    messageProps: PropTypes.object
};

export { TextMsg };
