import { useTheme } from '@mui/material/styles';
import { AppBar, Link, Toolbar } from '@mui/material';

import Logo from 'components/logo/Logo';

function InfoAppBar() {
    let theme = useTheme();
    return (
        <>
            <AppBar elevation={0} position="fixed" sx={{ backgroundColor: theme.palette.background.paper }}>
                <Toolbar sx={{ justifyContent: 'center' }}>
                    <Link href="/info" sx={{ fontSize: 24 }}>
                        <Logo />
                    </Link>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
}

export default InfoAppBar;
