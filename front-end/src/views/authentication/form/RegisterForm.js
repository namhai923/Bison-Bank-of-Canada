import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    IconButton,
    FormHelperText,
    Grid,
    useMediaQuery,
    FormControl,
    OutlinedInput,
    InputLabel,
    Typography,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    password: Yup.string()
        .min(8, 'Should have more than 8 characters')
        .max(50, 'Cannot have more than 50 characters')
        .required('Password is required'),
    fname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('First Name is required'),
    lname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Last Name is required')
});

const RegisterForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    let [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    fname: '',
                    lname: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.fname && errors.fname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="firstname-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="firstname-register"
                                        type="text"
                                        value={values.fname}
                                        name="fname"
                                        onChange={handleChange}
                                    />
                                    {touched.fname && errors.fname && <FormHelperText error>{errors.fname}</FormHelperText>}
                                    {errors.submit && (
                                        <Box sx={{ mt: 3 }}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Box>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.lname && errors.lname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="lastname-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="lastname-register"
                                        type="text"
                                        value={values.lname}
                                        name="lname"
                                        onChange={handleChange}
                                    />
                                    {touched.lname && errors.lname && <FormHelperText error>{errors.lname}</FormHelperText>}
                                    {errors.submit && (
                                        <Box sx={{ mt: 3 }}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Box>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="email-register">Email Address / Username</InputLabel>
                            <OutlinedInput id="email-register" type="email" value={values.email} name="email" onChange={handleChange} />
                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="password-register">Password</InputLabel>
                            <OutlinedInput
                                id="password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: level?.length, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

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
