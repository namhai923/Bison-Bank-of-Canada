import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import bbcApi from 'api/bbcApi';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { setUser } from '../userSlice';
import { useDispatch } from 'react-redux';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    let username = '';
    const navigate = useNavigate();
    let dispatch = useDispatch();

    async function checkedEmail(username) {
        let user = await bbcApi.getUser(username);
        if (user === null) {
            return false;
        } else {
            let action = setUser({ userInfo: user });
            dispatch(action);
            return true;
        }
    }

    const toHomePage = async (username) => {
        if (await checkedEmail(username)) {
            navigate('/', { state: { name: username } });
        } else {
            alert('This email does not exist. Click on Create Account to make an account.');
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: ''
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                })}
                onSubmit={async () => {
                    username = document.getElementById('outlined-adornment-email-login').value;
                    toHomePage(username);
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
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

export default AuthLogin;
