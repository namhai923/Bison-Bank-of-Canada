import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, FormHelperText, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import RegisterForm from '../auth-forms/RegisterForm';
import { setUser } from '../../../store/userSlice';
import bbcApi from 'api/bbcApi';

const Register = () => {
    const theme = useTheme();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let location = useLocation();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    let [error, setError] = useState('');

    let handleSubmit = async (values) => {
        try {
            let userName = values.email;

            await bbcApi.createUser({ userName, firstName: values.fname, lastName: values.lname, accountBalance: values.balance });
            let userInfo = await bbcApi.getUser(userName);
            let action = setUser(userInfo);
            dispatch(action);
            if (location.state?.from) {
                navigate(location.state.from);
            } else {
                navigate('/');
            }
        } catch (error) {
            if (error.name === 'AxiosError') {
                setError(error.response.data);
            }
            console.log(error);
        }
    };

    return (
        <AuthWrapper>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Sign up
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography>
                                                    <FormHelperText error>{error}</FormHelperText>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RegisterForm handleSubmit={handleSubmit} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography component={Link} to="/login" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                                Already have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default Register;
