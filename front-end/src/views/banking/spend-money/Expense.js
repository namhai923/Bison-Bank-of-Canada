import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Button, CardActions, FormHelperText, TextField, Grid, useMediaQuery } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import bbcApi from 'api/bbcApi';
import { addExpense } from 'store/userSlice';

const vSchema = Yup.object().shape({
    location: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Location is required'),
    category: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Category is required'),
    amount: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
});

let Expense = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    let dispatch = useDispatch();
    let userInfo = useSelector((state) => state.user);

    let handleSubmit = async (values) => {
        toast.promise(
            bbcApi
                .expense({
                    userName: userInfo.userName,
                    password: sessionStorage.getItem('password'),
                    location: values.location,
                    category: values.category,
                    amount: values.amount
                })
                .then((result) => {
                    let action = addExpense(result);
                    dispatch(action);
                }),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Hooray 🎉🎉🎉',
                error: {
                    render({ data }) {
                        if (data.name === 'AxiosError') {
                            return data.response.data;
                        } else {
                            console.log(data);
                        }
                    }
                }
            }
        );
    };

    return (
        <Formik
            initialValues={{
                location: '',
                category: '',
                amount: ''
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
                                label="Location"
                                name="location"
                                onChange={handleChange}
                                type="text"
                                required
                                value={values.location}
                            />
                            {touched.location && errors.location && <FormHelperText error>{errors.location}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                onChange={handleChange}
                                type="text"
                                required
                                value={values.category}
                            />
                            {touched.category && errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
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
                            Pay
                        </Button>
                    </CardActions>
                </form>
            )}
        </Formik>
    );
};

export default Expense;
export { vSchema };
