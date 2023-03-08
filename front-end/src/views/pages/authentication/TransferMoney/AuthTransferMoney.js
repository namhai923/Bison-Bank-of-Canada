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

async function checkedAmount(username, amount) {
    amount = parseFloat(amount);
    //console.log(amount);
    let expense = await bbcApi.getUser(username);
    if (amount <= 0) {
        return 100;
    }
    if (expense.accountBalance < amount) {
        return null;
    }
    if (amount % 1 == 0) {
        return true;
    }
    let am = amount.toFixed(2);
    if (amount != am) {
        return false;
    }
    return true;
}

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthTransferMoney = ({ ...others }) => {
    const theme = useTheme();
    let username = '';
    let amountEntered = 0;
    let checkA = 0;
    const navigate = useNavigate();
    const toHomePage = async (username, amount) => {
        if (await checkedEmail(username)) {
            checkA = await checkedAmount(username, amount);
            if (checkA == 100) {
                alert('Please do not enter 0 or a negative number.');
            } else {
                if (checkA == null) {
                    alert('You do not have enough money to transfer this amount. Please insert a lower amount.');
                } else {
                    if (checkA) {
                        //navigate('/', { state: { name: username } });
                    } else {
                        alert('This is not a valid amount. Please input a whole number or a number up to two decimal places');
                    }
                }
            }
        } else {
            alert('This user does not exist. Please check you have typed their email correctly.');
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
                    email: '',
                    amount: 0
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                })}
                onSubmit={async () => {
                    username = document.getElementById('outlined-adornment-email-login').value;
                    amountEntered = document.getElementById('outlined-adornment-amount').value;
                    toHomePage(username, amountEntered);
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
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
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
