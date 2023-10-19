import PropTypes from 'prop-types';
import { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/extended/AnimateButton';
import usePersistLogin from 'utils/usePersistLogin';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    password: Yup.string()
        .min(8, 'Should have more than 8 characters')
        .max(50, 'Cannot have more than 50 characters')
        .required('Password is required')
});

const LoginForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();
    let [persistLogin, setPersistLogin] = usePersistLogin();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="email-login"
                                type="email"
                                label="Email Address / Username"
                                data-testid="UsernameInputBox"
                                value={values.email}
                                name="email"
                                onChange={handleChange}
                            />
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
                            <InputLabel htmlFor="password-login">Password</InputLabel>
                            <OutlinedInput
                                id="password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={persistLogin}
                                    onChange={() => setPersistLogin((prev) => !prev)}
                                    name="checked"
                                    color="primary"
                                />
                            }
                            label="Remember me"
                        />
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    data-testid="sign"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

LoginForm.propTypes = {
    handleSubmit: PropTypes.func
};

export default LoginForm;
export { vSchema };
