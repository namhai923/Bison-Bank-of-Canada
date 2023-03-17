import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Card, CardActions, CardContent, FormHelperText, CardHeader, Divider, Stack, TextField } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import bbcApi from 'api/bbcApi';
import { setUser } from 'views/authentication/userSlice';
const vSchema = Yup.object().shape({
    receiver: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    amount: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
});
export { vSchema };

let Transfer = () => {
    let dispatch = useDispatch();
    let [error, setError] = useState('');
    let userInfo = useSelector((state) => state.user);

    let handleSubmit = async (values) => {
        try {
            let userName = userInfo.userName;
            if (userName !== '') {
                let updateUser = await bbcApi.transfer({ userName, receiverName: values.receiver, amount: values.amount });
                let action = setUser(updateUser);
                dispatch(action);
                setError('');
                alert('Your money is successfully transfered');
            } else {
                setError('You have to login first');
            }
        } catch (error) {
            if (error.name === 'AxiosError') {
                setError(error.response.data);
            }
            console.log(error);
        }
    };

    return (
        <Formik
            initialValues={{
                receiver: '',
                amount: ''
            }}
            validationSchema={vSchema}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader title="Transfer" />
                        <Divider />

                        <CardContent>
                            <Stack spacing={1} sx={{ maxWidth: 400 }}>
                                <FormHelperText error>{error}</FormHelperText>
                                <TextField
                                    fullWidth
                                    label="Receiver"
                                    name="receiver"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="email"
                                    value={values.receiver}
                                />
                                {touched.receiver && errors.receiver && (
                                    <FormHelperText error id="standard-weight-helper-text-receiver-register">
                                        {errors.receiver}
                                    </FormHelperText>
                                )}
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    value={values.amount}
                                    name="amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched.amount && errors.amount && (
                                    <FormHelperText error id="standard-weight-helper-text-amount-register">
                                        {errors.amount}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-start' }}>
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
                                    Send
                                </Button>
                            </AnimateButton>
                        </CardActions>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default Transfer;
