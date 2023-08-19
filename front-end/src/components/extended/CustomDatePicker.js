import PropTypes from 'prop-types';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

let CustomDatePicker = (props) => {
    let { label, field, form } = props;
    let { name } = field;

    let handleChange = (value) => {
        form.setFieldValue(name, value);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...field}
                name={name}
                label={label}
                onChange={handleChange}
                fullWidth
                renderInput={(params) => <TextField {...params} fullWidth />}
            />
        </LocalizationProvider>
    );
};

CustomDatePicker.propTypes = {
    label: PropTypes.string,
    field: PropTypes.object,
    form: PropTypes.object
};

export default CustomDatePicker;
