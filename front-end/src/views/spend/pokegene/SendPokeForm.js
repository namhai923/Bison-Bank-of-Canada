import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { Button, FormHelperText, useMediaQuery, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Formik, FastField } from 'formik';

import Loader from 'components/loader/Loader';
import CustomSelect from 'components/custom-select/CustomSelect';
import { useGetContactsQuery } from 'app/features/contact/contactApiSlice';
import config from 'assets/data/config';

let SendPokeForm = (props) => {
    let { handleSubmit } = props;

    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

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

    const vSchema = Yup.object().shape({
        receiver: Yup.array()
            .min(1, 'Receiver is required')
            .of(Yup.string().email('Must be a valid email').max(50).required('Email is required'))
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
                        receiver: []
                    }}
                    validationSchema={vSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, handleSubmit, isSubmitting, touched, values }) => {
                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={matchDownSM ? 1 : 2}>
                                    <Grid item xs={12}>
                                        <FastField
                                            fullWidth
                                            name="receiver"
                                            placeholder="Emails / Usernames"
                                            component={CustomSelect}
                                            options={contacts.map((item) => {
                                                return {
                                                    value: item['userName'],
                                                    label: item['userName'],
                                                    color: theme.palette.primary.main
                                                };
                                            })}
                                            isOptionDisabled={() => values['receiver'].length >= 1}
                                            creatable
                                        />
                                        {touched.receiver && errors.receiver && <FormHelperText error>{errors.receiver}</FormHelperText>}
                                    </Grid>
                                    <Grid container item xs={12} direction="row" justifyContent="flex-end">
                                        <Button disableElevation type="submit" disabled={isSubmitting} variant="contained">
                                            Send
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        );
                    }}
                </Formik>
            </>
        );
    }
    return content;
};

SendPokeForm.propTypes = {
    handleSubmit: PropTypes.func
};

export default SendPokeForm;
