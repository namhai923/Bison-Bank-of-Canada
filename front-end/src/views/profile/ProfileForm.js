import { useSelector, useDispatch } from 'react-redux';

import {
    FormHelperText,
    Box,
    Button,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';
import * as Yup from 'yup';
import { Formik, Form, FastField } from 'formik';
import { toast } from 'react-toastify';
import { matchIsValidTel } from 'mui-tel-input';

import SubCard from 'ui-component/cards/SubCard';
import bbcApi from 'api/bbcApi';
import { setUser } from 'store/userSlice';
import CustomDatePicker from 'ui-component/extended/CustomDatePicker';
import CustomTelInput from 'ui-component/extended/CustomTelInput';

const vSchema = Yup.object().shape({
    fname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('First Name is required'),
    lname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Last Name is required')
});

function validDate(value) {
    let error;
    let date = new Date(value);
    if (value && !(date instanceof Date && !isNaN(date.valueOf()))) {
        error = 'Invalid date';
    }
    return error;
}

function validPhone(value) {
    let error;
    if (value !== '' && !matchIsValidTel(value)) {
        error = 'Invalid phone number';
    }
    return error;
}

let ProfileForm = () => {
    let dispatch = useDispatch();
    let userInfo = useSelector((state) => state.user);

    let handleSubmit = async (values) => {
        console.log(values);

        toast.promise(
            bbcApi
                .updateUser({
                    userName: userInfo.userName,
                    firstName: values.fname,
                    lastName: values.lname,
                    dob: values.dob ?? '',
                    phoneNumber: values.phone
                })
                .then((result) => {
                    let action = setUser(result);
                    dispatch(action);
                }),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Profile updated 🎉🎉🎉',
                error: {
                    render({ data }) {
                        if (data.name === 'AxiosError') {
                            return data.response.data;
                        } else {
                            console.log(data);
                        }
                    }
                }
            }
        );
    };

    return (
        <SubCard>
            <Formik
                initialValues={{
                    fname: userInfo.firstName,
                    lname: userInfo.lastName,
                    dob: userInfo.dob || '',
                    phone: userInfo.phoneNumber || ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, isSubmitting, touched, values }) => (
                    <Form>
                        <CardHeader subheader="The information can be edited" title="Profile" />
                        <CardContent sx={{ pt: 0 }}>
                            <Box sx={{ m: -1.5 }}>
                                <Grid container spacing={3}>
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
                                        <FastField name="dob" component={CustomDatePicker} label="Date of Birth" validate={validDate} />
                                        {errors.dob && touched.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <FastField name="phone" component={CustomTelInput} label="Phone number" validate={validPhone} />
                                        {errors.phone && touched.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                        <Divider />
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

export default ProfileForm;
