import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, Grid, TextField, useMediaQuery } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    fname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('First Name is required'),
    lname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Last Name is required'),
    balance: Yup.number()
        .min(0, "Can't be negative")
        .max(100000, 'Too much, less than $100,000 please')
        .integer('Should be an integer')
        .required('Account balance is required')
});

const RegisterForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fname: '',
                    lname: '',
                    balance: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    sx={{ ...theme.typography.customInput }}
                                    type="text"
                                    label="First Name"
                                    value={values.fname}
                                    name="fname"
                                    required
                                    onChange={handleChange}
                                />
                                {touched.fname && errors.fname && <FormHelperText error>{errors.fname}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    sx={{ ...theme.typography.customInput }}
                                    type="text"
                                    label="Last Name"
                                    value={values.lname}
                                    name="lname"
                                    required
                                    onChange={handleChange}
                                />
                                {touched.lname && errors.lname && <FormHelperText error>{errors.lname}</FormHelperText>}
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            sx={{ ...theme.typography.customInput }}
                            id="outlined-adornment-email-register"
                            type="email"
                            label="Email Address / Username"
                            value={values.email}
                            name="email"
                            required
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}

                        <TextField
                            fullWidth
                            sx={{ ...theme.typography.customInput }}
                            id="outlined-adornment-balance-register"
                            type="number"
                            label="Account Balance"
                            value={values.balance}
                            name="balance"
                            required
                            onChange={handleChange}
                            inputProps={{}}
                        />
                        {touched.balance && errors.balance && <FormHelperText error>{errors.balance}</FormHelperText>}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    data-testid="signUpButton"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

RegisterForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
};

export default RegisterForm;
export { vSchema };
