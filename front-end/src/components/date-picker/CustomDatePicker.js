import PropTypes from 'prop-types';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

let CustomDatePicker = (props) => {
    let { label, field, form, handleDateChange } = props;
    let { name } = field;

    let handleChange = handleDateChange
        ? (value) => {
              handleDateChange(value);
              form.setFieldValue(name, value);
          }
        : (value) => {
              form.setFieldValue(name, value);
          };

    let handleKeyDown = (event) => {
        event.preventDefault();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...field}
                name={name}
                label={label}
                onChange={handleChange}
                fullWidth
                disableFuture
                renderInput={(params) => <TextField autoComplete="off" onKeyDown={handleKeyDown} {...params} fullWidth />}
            />
        </LocalizationProvider>
    );
};

CustomDatePicker.propTypes = {
    label: PropTypes.string,
    field: PropTypes.object,
    form: PropTypes.object,
    handleDateChange: PropTypes.func
};

export default CustomDatePicker;
