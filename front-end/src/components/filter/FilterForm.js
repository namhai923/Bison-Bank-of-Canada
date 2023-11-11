import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { InputLabel } from '@mui/material';

import { Form, FastField, Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, TextField } from '@mui/material';

import CustomDatePicker from 'components/date-picker/CustomDatePicker';
import CustomSelect from 'components/custom-select/CustomSelect';
import NumericFormatCustom from 'utils/NumericFormatCustom';
import { setFilter } from 'app/features/filter/filterSlice';

const FilterForm = (props) => {
    let { data, filterData, formikRef, selectRef } = props;
    let theme = useTheme();
    let dispatch = useDispatch();
    let filterInfo = useSelector((state) => state.filter);

    let initialValues = {};

    filterData.forEach((filter) => {
        if (filter.type === 'date' || filter.type === 'amount') {
            initialValues[`${filter.name}From`] = filterInfo[`${filter.name}From`];
            initialValues[`${filter.name}To`] = filterInfo[`${filter.name}To`];
        } else {
            initialValues[filter.name] = filterInfo[filter.name];
        }
    });

    let filterDateChange = (name) => {
        let handleDateChange = (value) => {
            let action;
            if (value === null) {
                action = setFilter({ type: name, value: value });
            } else {
                action = setFilter({ type: name, value: value.toISOString() });
            }
            dispatch(action);
        };
        return handleDateChange;
    };

    let filterSelectChange = (name) => {
        let handleSelectChange = (selectedValues) => {
            let action = setFilter({ type: name, value: selectedValues });
            dispatch(action);
        };
        return handleSelectChange;
    };

    let createOptions = (data) => {
        let options = new Set(data);
        options = [...options].map((item) => {
            return { value: item, label: item, color: theme.palette.primary.main };
        });
        return options;
    };

    return (
        <>
            <Formik initialValues={initialValues} innerRef={formikRef}>
                {({ values }) => {
                    return (
                        <Form>
                            <Grid container spacing={1}>
                                {filterData.map((filter) => {
                                    let formInput;
                                    if (filter.type === 'emails') {
                                        formInput = (
                                            <Grid item xs={12}>
                                                <FastField
                                                    name={filter.name}
                                                    placeholder={`--Filter by ${filter.label.toLowerCase()}`}
                                                    component={CustomSelect}
                                                    options={createOptions(data.map((item) => item['userName']))}
                                                    selectRef={selectRef}
                                                    defaultSelected={createOptions(filterInfo[filter.name])}
                                                    handleSelectChange={filterSelectChange(filter.name)}
                                                />
                                            </Grid>
                                        );
                                    } else if (filter.type === 'date') {
                                        formInput = (
                                            <>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item xs={5}>
                                                        <FastField
                                                            name={`${filter.name}From`}
                                                            handleDateChange={filterDateChange(`${filter.name}From`)}
                                                            label="From"
                                                            component={CustomDatePicker}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography align="center" variant="h3">
                                                            -
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FastField
                                                            name={`${filter.name}To`}
                                                            handleDateChange={filterDateChange(`${filter.name}To`)}
                                                            label="To"
                                                            component={CustomDatePicker}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        );
                                    } else if (filter.type === 'amount') {
                                        formInput = (
                                            <>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item xs={5}>
                                                        <FastField>
                                                            {({ form }) => (
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder="From"
                                                                    name={`${filter.name}From`}
                                                                    value={values[`${filter.name}From`]}
                                                                    autoComplete="off"
                                                                    required
                                                                    onChange={(event) => {
                                                                        let action = setFilter({
                                                                            type: event.target.name,
                                                                            value: event.target.value
                                                                        });
                                                                        dispatch(action);
                                                                        form.setFieldValue(`${filter.name}From`, event.target.value);
                                                                    }}
                                                                    InputProps={{
                                                                        inputComponent: NumericFormatCustom
                                                                    }}
                                                                />
                                                            )}
                                                        </FastField>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography align="center" variant="h3">
                                                            -
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FastField>
                                                            {({ form }) => (
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder="To"
                                                                    name={`${filter.name}To`}
                                                                    value={values[`${filter.name}To`]}
                                                                    autoComplete="off"
                                                                    required
                                                                    onChange={(event) => {
                                                                        let action = setFilter({
                                                                            type: event.target.name,
                                                                            value: event.target.value
                                                                        });
                                                                        dispatch(action);
                                                                        form.setFieldValue(`${filter.name}To`, event.target.value);
                                                                    }}
                                                                    InputProps={{
                                                                        inputComponent: NumericFormatCustom
                                                                    }}
                                                                />
                                                            )}
                                                        </FastField>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        );
                                    }
                                    return (
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <InputLabel focused sx={{ ...theme.typography.customInput }} htmlFor={filter.name}>
                                                        {filter.label}
                                                    </InputLabel>
                                                </Grid>
                                                {formInput}
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

FilterForm.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object),
    formikRef: PropTypes.object,
    selectRef: PropTypes.object
};

export default FilterForm;
