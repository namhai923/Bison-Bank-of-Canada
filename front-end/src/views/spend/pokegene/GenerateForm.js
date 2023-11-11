import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { FastField, Form, Formik } from 'formik';
import { Grid } from '@mui/material';

import TYPES from 'assets/data/pokegene/TYPES';
import GenerateField from './GenerateField';
import CustomSelect from 'components/custom-select/CustomSelect';
import { setValue } from 'app/features/value/valueSlice';

const GenerateForm = (props) => {
    let { initialValues } = props;
    let dispatch = useDispatch();

    let handleSelectChange = (selectedOptions) => {
        let action = setValue({ type: 'pokemonTypes', value: selectedOptions });
        dispatch(action);
    };

    return (
        <Formik initialValues={initialValues}>
            {({ values }) => {
                return (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FastField
                                    name="pokemonTypes"
                                    component={CustomSelect}
                                    options={TYPES.map((type) => {
                                        let { value, label, color } = type;
                                        return { value, label, color };
                                    })}
                                    defaultSelected={values['pokemonTypes'].map((selectedType) => {
                                        let { value, label, color } = TYPES.find((type) => type.value === selectedType);
                                        return { value, label, color };
                                    })}
                                    handleSelectChange={handleSelectChange}
                                    isOptionDisabled={() => values['pokemonTypes'].length >= 2}
                                    placeholder="--Choose types for your pokemon--"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FastField name="pokemon" component={GenerateField} />
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

GenerateForm.propTypes = {
    handleSubmit: PropTypes.func,
    initialValues: PropTypes.object
};

export default GenerateForm;
