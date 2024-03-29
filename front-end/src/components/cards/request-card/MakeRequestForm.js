import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';

import { useTheme } from '@mui/material/styles';
import { Button, FormHelperText, TextField, useMediaQuery, Grid, Typography } from '@mui/material';
import * as Yup from 'yup';
import { Formik, FastField } from 'formik';

import Loader from 'components/loader/Loader';
import CustomSelect from 'components/custom-select/CustomSelect';
import { useGetContactsQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';
import NumericFormatCustom from 'utils/NumericFormatCustom';
import { setRequestValue } from 'app/features/request/requestSlice';

const DESCRIPTION_MAX = 100;

let MakeRequestForm = (props) => {
    let { name, handleSubmit } = props;
    let requestFormValue = useSelector((state) => state.request);

    const theme = useTheme();
    let selectRef = useRef(null);
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    let dispatch = useDispatch();

    let handleSelectChange = (selectedValues) => {
        let action = setRequestValue({ type: `${name}Emails`, value: selectedValues });
        dispatch(action);
    };

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
        [`${name}Emails`]: Yup.array()
            .min(1, 'Should have at least 1 email')
            .of(Yup.string().email('Must be a valid email').max(50).required('Email is required'))
            .required('Email is required'),
        [`${name}Amount`]: Yup.number().min(1, 'Should be greater than 0').required('Amount is required')
    });

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        let initialValues = {};

        initialValues[`${name}Emails`] = requestFormValue[`${name}Emails`];
        initialValues[`${name}Amount`] = requestFormValue[`${name}Amount`];
        initialValues[`${name}Description`] = requestFormValue[`${name}Description`];

        content = (
            <>
                <Formik
                    initialValues={initialValues}
                    validationSchema={vSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values);
                        actions.resetForm({
                            values: {
                                [`${name}Emails`]: [],
                                [`${name}Amount`]: '',
                                [`${name}Description`]: ''
                            }
                        });

                        dispatch(setRequestValue({ type: `${name}Emails`, value: [] }));
                        dispatch(setRequestValue({ type: `${name}Amount`, value: '' }));
                        dispatch(setRequestValue({ type: `${name}Description`, value: '' }));
                        selectRef?.current?.clearValue();
                    }}
                >
                    {({ errors, handleSubmit, isSubmitting, touched, values }) => {
                        return (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container spacing={matchDownSM ? 1 : 2}>
                                    <Grid item xs={12}>
                                        <FastField
                                            fullWidth
                                            name={`${name}Emails`}
                                            placeholder="Emails / Usernames"
                                            component={CustomSelect}
                                            selectRef={selectRef}
                                            data={contacts}
                                            optionValue="userName"
                                            defaultSelected={requestFormValue[`${name}Emails`]}
                                            handleSelectChange={handleSelectChange}
                                            color={theme.palette.primary.main}
                                            creatable
                                        />
                                        {touched[`${name}Emails`] && errors[`${name}Emails`] && (
                                            <FormHelperText error>{errors[`${name}Emails`]}</FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FastField>
                                            {({ form }) => (
                                                <TextField
                                                    name={`${name}Amount`}
                                                    fullWidth
                                                    placeholder="Amount"
                                                    value={values[`${name}Amount`]}
                                                    required
                                                    autoComplete="off"
                                                    onChange={(event) => {
                                                        let action = setRequestValue({
                                                            type: event.target.name,
                                                            value: event.target.value
                                                        });
                                                        dispatch(action);
                                                        form.setFieldValue(`${name}Amount`, event.target.value);
                                                    }}
                                                    InputProps={{
                                                        inputComponent: NumericFormatCustom
                                                    }}
                                                />
                                            )}
                                        </FastField>

                                        {touched[`${name}Amount`] && errors[`${name}Amount`] && (
                                            <FormHelperText error>{errors[`${name}Amount`]}</FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FastField>
                                            {({ form }) => (
                                                <TextField
                                                    name={`${name}Description`}
                                                    fullWidth
                                                    placeholder="Description..."
                                                    value={values[`${name}Description`]}
                                                    multiline
                                                    minRows={2}
                                                    maxRows={4}
                                                    onChange={(event) => {
                                                        let action = setRequestValue({
                                                            type: event.target.name,
                                                            value: event.target.value
                                                        });
                                                        dispatch(action);
                                                        form.setFieldValue(`${name}Description`, event.target.value);
                                                    }}
                                                    inputProps={{
                                                        maxLength: DESCRIPTION_MAX
                                                    }}
                                                />
                                            )}
                                        </FastField>

                                        <Typography variant="subtitle1" align="right">{`${
                                            values[`${name}Description`].length
                                        }/${DESCRIPTION_MAX}`}</Typography>
                                    </Grid>
                                </Grid>

                                <Button disableElevation type="submit" disabled={isSubmitting} variant="contained">
                                    Send
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            </>
        );
    }
    return content;
};

MakeRequestForm.propTypes = {
    name: PropTypes.string,
    handleSubmit: PropTypes.func
};

export default MakeRequestForm;
