import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Button, CardActions, FormHelperText, TextField, useMediaQuery, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

import { useAddTransferMutation } from 'app/features/user/userApiSlice';

const vSchema = Yup.object().shape({
    receiver: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    amount: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
});

let Transfer = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    let token = useSelector((state) => state.auth.token);
    let [addTransfer] = useAddTransferMutation({ skip: !token });

    let handleSubmit = async (values) => {
        toast.promise(
            addTransfer({
                userName: jwtDecode(token).userName,
                transferInfo: {
                    receiverName: values.receiver,
                    amount: values.amount
                }
            }).unwrap(),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Transfer proceeded 🎉🎉🎉',
                error: {
                    render({ data }) {
                        return data.data.message;
                    }
                }
            }
        );
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
            {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={matchDownSM ? 0 : 2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Receiver"
                                name="receiver"
                                onChange={handleChange}
                                type="email"
                                required
                                value={values.receiver}
                            />
                            {touched.receiver && errors.receiver && <FormHelperText error>{errors.receiver}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={values.amount}
                                name="amount"
                                required
                                onChange={handleChange}
                            />
                            {touched.amount && errors.amount && <FormHelperText error>{errors.amount}</FormHelperText>}
                        </Grid>
                    </Grid>

                    <CardActions sx={{ justifyContent: 'flex-start' }}>
                        <Button disableElevation type="submit" disabled={isSubmitting} variant="contained">
                            Send
                        </Button>
                    </CardActions>
                </form>
            )}
        </Formik>
    );
};

export default Transfer;
export { vSchema };
