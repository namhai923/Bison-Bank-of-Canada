import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonBase } from '@mui/material';

import config from 'assets/data/config';
import Logo from 'components/logo/Logo';
import { openMenu } from 'app/features/customize/customizeSlice';

const LogoSection = () => {
    const { defaultId } = useSelector((state) => state.customization);
    const dispatch = useDispatch();
    let handleClick = () => {
        let action = openMenu(defaultId);
        dispatch(action);
    };
    return (
        <ButtonBase disableRipple onClick={handleClick} component={Link} to={config.defaultPath}>
            <Logo />
        </ButtonBase>
    );
};

export default LogoSection;
