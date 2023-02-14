import { useTheme } from '@mui/material/styles';

const WelcomeMessage = () => {
    const theme = useTheme();
    var name = 'Bison';
    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {name}!</h1>;
};

export default WelcomeMessage;
