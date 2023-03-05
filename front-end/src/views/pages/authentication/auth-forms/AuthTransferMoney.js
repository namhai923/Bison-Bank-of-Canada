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

async function checkedEmail(username) {
    let expense = await bbcApi.getUser(username);
    console.log(expense);
    if (expense === null) {
        return false;
    } else {
        return true;
    }
}

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthTransferMoney = ({ ...others }) => {
    const theme = useTheme();
    let username = '';
    const navigate = useNavigate();

    const toHomePage = async (username) => {
        if (await checkedEmail(username)) {
            navigate('/', { state: { name: username } });
        } else {
            alert('This email does not exist. Click on Create Account to make an account.');
        }
    };
    const value = '125000';
    const valueDisplay = (value / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
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
                        <FormControl>
                            <InputLabel>Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                type="number"
                                value={values.amount}
                                name="amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Amount"
                                inputProps={{}}
                            />
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
                                    Transfer
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthTransferMoney;
