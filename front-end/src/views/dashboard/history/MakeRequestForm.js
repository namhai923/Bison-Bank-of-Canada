import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Button, FormHelperText, TextField, useMediaQuery, Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik, FastField } from 'formik';

import Loader from 'components/Loader';
import CustomSelect from 'components/custom-select/CustomSelect';
import { useGetContactsQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';
import NumericFormatCustom from 'utils/NumericFormatCustom';

const DESCRIPTION_MAX = 100;

const vSchema = Yup.object().shape({
    emails: Yup.array()
        .min(1, 'Should have at least 1 email')
        .of(Yup.string().email('Must be a valid email').max(50).required('Email is required'))
        .required('Email is required'),
    amount: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
});

let MakeRequestForm = (props) => {
    let { handleSubmit } = props;

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

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        content = (
            <>
                <Formik
                    initialValues={{
                        emails: selectInfo.emails,
                        amount: undefined,
                        description: ''
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
                                        placeholder="Amount"
                                        value={values.amount}
                                        name="amount"
                                        required
                                        onChange={handleChange}
                                        InputProps={{
                                            inputComponent: NumericFormatCustom
                                        }}
                                    />
                                    {touched.amount && errors.amount && <FormHelperText error>{errors.amount}</FormHelperText>}
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        placeholder="Description..."
                                        value={values.description}
                                        multiline
                                        minRows={2}
                                        maxRows={4}
                                        name="description"
                                        onChange={handleChange}
                                        inputProps={{
                                            maxLength: DESCRIPTION_MAX
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        align="right"
                                    >{`${values.description.length}/${DESCRIPTION_MAX}`}</Typography>
                                </Grid>
                            </Grid>

                            <Button disableElevation type="submit" disabled={isSubmitting} variant="contained">
                                Send
                            </Button>
                        </form>
                    )}
                </Formik>
            </>
        );
    }
    return content;
};

MakeRequestForm.propTypes = {
    data: PropTypes.func
};

export default MakeRequestForm;
export { vSchema };
