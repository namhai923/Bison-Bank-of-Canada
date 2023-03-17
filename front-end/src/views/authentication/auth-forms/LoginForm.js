import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required')
});
export { vSchema };
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
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                data-testid="UsernameInputBox"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>
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
