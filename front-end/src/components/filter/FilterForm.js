import PropTypes from 'prop-types';

// third party
import { Form, FastField, Formik } from 'formik';
// project imports
import CustomSelect from '../extended/CustomSelect';

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
                                        component={CustomSelect}
                                        data={filterData}
                                        color={item.color}
                                        label={item.label}
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
