import { Link, useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import AuthWrapper from './wrapper/AuthWrapper';
import AuthCardWrapper from './wrapper/AuthCardWrapper';
import LoginForm from './form/LoginForm';
import Logo from 'components/logo/Logo';
import { useLoginMutation } from 'app/features/auth/authApiSlice';

const Login = () => {
    const theme = useTheme();
    let navigate = useNavigate();
    let location = useLocation();
    const [login] = useLoginMutation();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    let handleSubmit = async (values) => {
        toast.promise(login({ userName: values.email, password: values.password }).unwrap(), {
            pending: 'Hold on a sec ⌛',
            success: {
                render() {
                    if (location.state?.from) {
                        navigate(location.state.from);
                    } else {
                        navigate('/');
                    }
                    return 'Login successfully 🎉🎉🎉';
                }
            },
            error: {
                render({ data }) {
                    return data.data.message;
                }
            }
        });
    };

    return (
        <AuthWrapper>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 0 }}>
                                        <Logo />
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
                                                        Hi, Welcome Back
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <LoginForm handleSubmit={handleSubmit} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                                                Create Account
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

export default Login;
