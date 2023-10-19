import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { InputLabel } from '@mui/material';

import { Form, FastField, Formik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, TextField } from '@mui/material';

import CustomDatePicker from 'components/extended/CustomDatePicker';
import CustomSelect from 'components/custom-select/CustomSelect';
import NumericFormatCustom from 'utils/NumericFormatCustom';
import { setValue } from 'app/features/value/valueSlice';

const FilterForm = (props) => {
    let { data, filterData } = props;
    let theme = useTheme();
    let dispatch = useDispatch();

    let filterInfo = useSelector((state) => state.value);

    let initialValues = {};

    filterData.forEach((filter) => {
        if (filter.type === 'date' || filter.type === 'amount') {
            initialValues[`${filter.name}From`] = filterInfo[`${filter.name}From`];
            initialValues[`${filter.name}To`] = filterInfo[`${filter.name}To`];
        } else {
            initialValues[filter.name] = filterInfo[filter.name];
        }
    });

    return (
        <>
            <Formik initialValues={initialValues}>
                {({ values }) => {
                    return (
                        <Form>
                            <Grid container spacing={1}>
                                {filterData.map((filter) => {
                                    let formInput;
                                    if (filter.type === 'userName') {
                                        formInput = (
                                            <Grid item xs={12}>
                                                <FastField
                                                    name={filter.name}
                                                    placeholder={`--Filter by ${filter.label.toLowerCase()}`}
                                                    component={CustomSelect}
                                                    data={data}
                                                    optionValue={'userName'}
                                                    color={theme.palette.primary.main}
                                                />
                                            </Grid>
                                        );
                                    } else if (filter.type === 'date') {
                                        formInput = (
                                            <>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item xs={5}>
                                                        <FastField name={`${filter.name}From`} component={CustomDatePicker} />
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography align="center" variant="h3">
                                                            -
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <FastField name={`${filter.name}To`} component={CustomDatePicker} />
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
                                                            {() => (
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder="From"
                                                                    name={`${filter.name}From`}
                                                                    value={values[`${filter.name}From`]}
                                                                    autoComplete="off"
                                                                    required
                                                                    onChange={(event) => {
                                                                        let action = setValue({
                                                                            type: event.target.name,
                                                                            value: event.target.value
                                                                        });
                                                                        dispatch(action);
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
                                                            {() => (
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder="To"
                                                                    name={`${filter.name}To`}
                                                                    value={values[`${filter.name}To`]}
                                                                    autoComplete="off"
                                                                    required
                                                                    onChange={(event) => {
                                                                        let action = setValue({
                                                                            type: event.target.name,
                                                                            value: event.target.value
                                                                        });
                                                                        dispatch(action);
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
    filterData: PropTypes.arrayOf(PropTypes.object)
};

export default FilterForm;
