import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import {
    FormHelperText,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    TextField,
    useMediaQuery,
    Unstable_Grid2 as Grid
} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, FastField } from 'formik';
import { matchIsValidTel } from 'mui-tel-input';

import SubCard from 'components/cards/SubCard';
import CustomDatePicker from 'components/date-picker/CustomDatePicker';
import CustomTelInput from 'components/tel-input/CustomTelInput';

const vSchema = Yup.object().shape({
    fname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('First Name is required'),
    lname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Last Name is required'),
    dob: Yup.date().nullable().max(new Date(), 'Invalid date')
});

function validPhone(value) {
    let error;
    if (value !== '' && !matchIsValidTel(value)) {
        error = 'Invalid phone number';
    }
    return error;
}

let ProfileForm = (props) => {
    let { firstName, lastName, dob, phoneNumber, handleSubmit } = props;
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <SubCard>
            <Formik
                initialValues={{
                    fname: firstName,
                    lname: lastName,
                    dob: dob,
                    phone: phoneNumber || ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, isSubmitting, touched, values }) => (
                    <Form>
                        <CardHeader subheader="The information can be edited" title="Profile" />
                        <CardContent sx={{ p: 0 }}>
                            <Grid container spacing={matchDownSM ? 2 : 2}>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="First name"
                                        name="fname"
                                        type="text"
                                        onChange={handleChange}
                                        required
                                        value={values.fname}
                                    />
                                    {touched.fname && errors.fname && <FormHelperText error>{errors.fname}</FormHelperText>}
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last name"
                                        name="lname"
                                        type="text"
                                        onChange={handleChange}
                                        required
                                        value={values.lname}
                                    />
                                    {touched.lname && errors.lname && <FormHelperText error>{errors.lname}</FormHelperText>}
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <FastField name="dob" component={CustomDatePicker} label="Date of Birth" />
                                    {errors.dob && touched.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <FastField name="phone" component={CustomTelInput} label="Phone number" validate={validPhone} />
                                    {errors.phone && touched.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <Button disableElevation type="submit" disabled={isSubmitting} variant="contained">
                                Save details
                            </Button>
                        </CardActions>
                    </Form>
                )}
            </Formik>
        </SubCard>
    );
};

ProfileForm.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
    phoneNumber: PropTypes.string,
    handleSubmit: PropTypes.func
};

export default ProfileForm;
