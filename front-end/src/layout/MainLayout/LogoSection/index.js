import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'assets/data/config';
import Logo from 'components/Logo';
import { openMenu } from 'app/features/customize/customizeSlice';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
    const defaultId = useSelector((state) => state.customization.defaultId);
    const dispatch = useDispatch();
    let handleClick = () => {
        let action = openMenu({ id: defaultId });
        dispatch(action);
    };
    return (
        <ButtonBase disableRipple onClick={handleClick} component={Link} to={config.defaultPath}>
            <Logo />
        </ButtonBase>
    );
};

export default LogoSection;
