import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import RegisterForm from '../auth-forms/RegisterForm';
import bbcApi from 'api/bbcApi';

const Register = () => {
    const theme = useTheme();
    let navigate = useNavigate();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    let handleSubmit = async (values) => {
        toast.promise(
            bbcApi
                .registerUser({
                    userName: values.email,
                    password: values.password,
                    firstName: values.fname,
                    lastName: values.lname,
                    accountBalance: values.balance
                })
                .then(() => {
                    navigate('/login');
                }),
            {
                pending: 'Hold on a sec ⌛',
                success: 'Account created successfully 🎉🎉🎉',
                error: {
                    render({ data }) {
                        if (data.name === 'AxiosError') {
                            return data.response.data.message;
                        } else {
                            console.log(data);
                        }
                    }
                }
            }
        );
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
