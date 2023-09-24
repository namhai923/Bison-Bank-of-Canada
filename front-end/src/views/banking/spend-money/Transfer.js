import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Button, CardActions, FormHelperText, TextField, useMediaQuery, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Formik, FastField } from 'formik';
import { toast } from 'react-toastify';

import CustomSelect from 'components/custom-select/CustomSelect';
import { useAddTransferMutation, useGetContactsQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const vSchema = Yup.object().shape({
    emails: Yup.array().of(Yup.string().email('Must be a valid email').max(50).required('Email is required')).required('Email is required'),
    amount: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
});

let Transfer = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    let selectInfo = useSelector((state) => state.value);

    let {
        data: contacts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetContactsQuery('contacts', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let [addTransfer] = useAddTransferMutation();
    let handleSubmit = async (values) => {
        console.log(values);
        toast.promise(
            addTransfer({
                transferAccounts: values.emails,
                amount: values.amount
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

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        content = (
            <Formik
                initialValues={{
                    emails: selectInfo.emails,
                    amount: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <FastField
                                    fullWidth
                                    name="emails"
                                    placeholder="Emails / Usernames"
                                    component={CustomSelect}
                                    data={contacts}
                                    optionValue="userName"
                                    color={theme.palette.primary.main}
                                    creatable={true}
                                />
                                {touched.emails && errors.emails && <FormHelperText error>{errors.emails}</FormHelperText>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder="Amount"
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
    }
    return content;
};

export default Transfer;
export { vSchema };
