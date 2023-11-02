import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import { ButtonBase, FormControl, FormHelperText, InputAdornment } from '@mui/material';
import { IconUser, IconPlus } from '@tabler/icons-react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { AvatarStyle, OutlineInputStyle } from 'components/styled-input';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required')
});

const AddContactForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();

    return (
        <>
            <Formik
                initialValues={{
                    email: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl error={Boolean(touched.email && errors.email)}>
                            <OutlineInputStyle
                                id="email-add-contact"
                                value={values.email}
                                type="email"
                                placeholder="Email / Username"
                                onChange={handleChange}
                                autoComplete="off"
                                name="email"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconUser stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <ButtonBase type="submit" sx={{ borderRadius: '12px' }} disabled={isSubmitting}>
                                            <AvatarStyle color={theme.palette.secondary} variant="rounded">
                                                <IconPlus stroke={1.5} size="1.3rem" />
                                            </AvatarStyle>
                                        </ButtonBase>
                                    </InputAdornment>
                                }
                            />
                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                            {errors.submit && <FormHelperText error>{errors.submit}</FormHelperText>}
                        </FormControl>
                    </form>
                )}
            </Formik>
        </>
    );
};

AddContactForm.propTypes = {
    handleSubmit: PropTypes.func
};

export default AddContactForm;
export { vSchema };
