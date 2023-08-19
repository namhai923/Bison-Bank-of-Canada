import PropTypes from 'prop-types';

import { MuiTelInput } from 'mui-tel-input';

let CustomTelInput = (props) => {
    let { label, field, form } = props;
    let { name } = field;

    let handleChange = (value) => {
        form.setFieldValue(name, value);
    };

    return <MuiTelInput {...field} name={name} label={label} onChange={handleChange} fullWidth />;
};

CustomTelInput.propTypes = {
    label: PropTypes.string,
    field: PropTypes.object,
    form: PropTypes.object
};

export default CustomTelInput;
