// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/high-resolution.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return <img src={logo} alt="Berry" width={75} />;
};

export default Logo;
