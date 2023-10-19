import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

import { setValue } from 'app/features/value/valueSlice';

let CustomDatePicker = (props) => {
    let { label, field, form } = props;
    let { name } = field;
    let dispatch = useDispatch();

    let handleChange = (value) => {
        let action;
        if (value === null) {
            action = setValue({ type: name, value: value });
        } else {
            action = setValue({ type: name, value: value.toISOString() });
        }
        dispatch(action);
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
