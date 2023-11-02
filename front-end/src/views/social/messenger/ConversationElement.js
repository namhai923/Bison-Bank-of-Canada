import PropTypes from 'prop-types';
import { useState } from 'react';

import { Stack, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment/moment';

const TextMsg = (props) => {
    let { messageProps } = props;
    const theme = useTheme();
    let [timeDisplay, setTimeDisplay] = useState(null);

    return (
        <Stack
            onMouseEnter={() => setTimeDisplay(messageProps._id)}
            onMouseLeave={() => setTimeDisplay(null)}
            direction="row"
            alignItems="center"
            justifyContent={messageProps.sending ? 'end' : 'start'}
        >
            {messageProps.sending && messageProps._id === timeDisplay && (
                <Typography sx={{ fontWeight: 600, paddingRight: '10px' }} variant="caption" color={theme.palette.grey[300]}>
                    {moment(messageProps.createdAt).calendar({
                        sameDay: 'LT',
                        lastWeek: 'ddd LT',
                        sameElse: function (now) {
                            if (this.isSame(now, 'year')) {
                                return 'MMM D, LT';
                            } else {
                                return 'DD/MM/Y';
                            }
                        }
                    })}
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
                    {moment(messageProps.createdAt).calendar({
                        sameDay: 'LT',
                        lastWeek: 'ddd LT',
                        sameElse: function (now) {
                            if (this.isSame(now, 'year')) {
                                return 'MMM D, LT';
                            } else {
                                return 'DD/MM/Y';
                            }
                        }
                    })}
                </Typography>
            )}
        </Stack>
    );
};

TextMsg.propTypes = {
    messageProps: PropTypes.object
};

export { TextMsg };
