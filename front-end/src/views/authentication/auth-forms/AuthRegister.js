import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import bbcApi from 'api/bbcApi';
import { setUser } from '../userSlice';

const AuthRegister = ({ ...others }) => {
    const theme = useTheme();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    let handleSubmit = async (values) => {
        let userName = values.email;
        let firstName = values.fname;
        let lastName = values.lname;
        let accountBalance = 0;
        if (values.balance) {
            accountBalance = values.balance;
        }
        await bbcApi.createUser({ userName, firstName, lastName, accountBalance });
        let userInfo = await bbcApi.getUser(userName);
        let action = setUser(userInfo);
        dispatch(action);
        navigate('/');
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fname: '',
                    lname: '',
                    balance: 0
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    fname: Yup.string().max(255).required('First Name is required'),
                    lname: Yup.string().max(255).required('Last Name is required'),
                    balance: Yup.number()
                        .min(0, "Can't be negative")
                        .max(100000, 'Too much, less than $100,000 please')
                        .integer('Should be an integer')
                        .nullable(true)
                })}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.fname && errors.fname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-fname-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-fname-register"
                                        type="text"
                                        value={values.fname}
                                        name="fname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.fname && errors.fname && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.fname}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.lname && errors.lname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-lname-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-lname-register"
                                        type="text"
                                        value={values.lname}
                                        name="lname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.lname && errors.lname && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.lname}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.balance && errors.balance)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-balance-register">Account Balance</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-balance-register"
                                type="number"
                                value={values.balance}
                                name="balance"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.balance && errors.balance && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.balance}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
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

export default AuthRegister;
