import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, TextField, FormHelperText } from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required')
});

const LoginForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();
    return (
        <>
            <Formik
                initialValues={{
                    email: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values.email)}
            >
                {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <TextField
                            sx={{ ...theme.typography.customInput }}
                            fullWidth
                            type="email"
                            label="Email Address / Username"
                            data-testid="UsernameInputBox"
                            value={values.email}
                            name="email"
                            required
                            onChange={handleChange}
                        />
                        {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    data-testid="sign"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

LoginForm.propTypes = {
    handleSubmit: PropTypes.func
};

export default LoginForm;
export { vSchema };
