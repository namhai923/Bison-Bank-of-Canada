import PropTypes from 'prop-types';

// third party
import { Form, FastField, Formik } from 'formik';
// project imports
import CustomSelect from 'components/custom-select/CustomSelect';

const FilterForm = (props) => {
    let { filterLabels, filterData } = props;

    return (
        <>
            <Formik
                initialValues={{
                    locations: [],
                    categories: []
                }}
                onSubmit={(values) => handleSubmit(values)}
            >
                {() => {
                    return (
                        <Form>
                            {filterLabels.map((item) => {
                                return (
                                    <FastField
                                        name={item.label.toLowerCase()}
                                        placeholder={`--Filter by ${item.label.toLowerCase()}`}
                                        component={CustomSelect}
                                        data={filterData}
                                        optionValue={item.label.toLowerCase()}
                                        color={item.color}
                                        label={item.label}
                                        creatable={false}
                                    />
                                );
                            })}
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

FilterForm.propTypes = {
    filterLabels: PropTypes.arrayOf(PropTypes.object),
    filterData: PropTypes.arrayOf(PropTypes.object)
};

export default FilterForm;
