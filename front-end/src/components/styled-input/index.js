import PropTypes from 'prop-types';

import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper } from '@mui/material';

import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

import Transitions from 'components/extended/Transitions';

import { IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

const PopperStyle = styled(Popper, { shouldForwardProp })(() => ({
    zIndex: 1100,
    width: '99%',
    top: '-55px !important',
    padding: '0 3rem'
}));

export const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: '100%'
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

export const AvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme, color }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    transition: 'all .2s ease-in-out',
    background: color.light,
    color: color.dark,
    '&:hover': {
        background: color.dark,
        color: color.light
    }
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileInput = (props) => {
    let { value, onChange, StartIcon, popupState } = props;
    const theme = useTheme();

    return (
        <OutlineInputStyle
            id="input-search-header"
            value={value}
            onChange={onChange}
            placeholder="Search"
            startAdornment={
                <InputAdornment position="start">
                    <StartIcon stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <Box sx={{ ml: 2 }}>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <AvatarStyle variant="rounded" color={theme.palette.orange} {...bindToggle(popupState)}>
                                <IconX stroke={1.5} size="1.3rem" />
                            </AvatarStyle>
                        </ButtonBase>
                    </Box>
                </InputAdornment>
            }
            aria-describedby="search-helper-text"
            inputProps={{ 'aria-label': 'weight' }}
        />
    );
};

MobileInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    StartIcon: PropTypes.element,
    popupState: PopupState
};

const StyledInput = (props) => {
    let { value, onChange, StartIcon, EndIcon, MobileIcon } = props;
    const theme = useTheme();

    return (
        <>
            {Boolean(MobileIcon) ? (
                <>
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <PopupState variant="popper" popupId="demo-popup-popper">
                            {(popupState) => (
                                <>
                                    <Box sx={{ ml: 2 }}>
                                        <ButtonBase sx={{ borderRadius: '12px' }}>
                                            <AvatarStyle color={theme.palette.secondary} variant="rounded" {...bindToggle(popupState)}>
                                                <MobileIcon stroke={1.5} size="1.3rem" />
                                            </AvatarStyle>
                                        </ButtonBase>
                                    </Box>
                                    <PopperStyle {...bindPopper(popupState)} transition>
                                        {({ TransitionProps }) => (
                                            <>
                                                <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                                                    <Card
                                                        sx={{
                                                            background: '#fff',
                                                            [theme.breakpoints.down('sm')]: {
                                                                border: 0,
                                                                boxShadow: 'none'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ p: 2 }}>
                                                            <Grid container alignItems="center" justifyContent="space-between">
                                                                <Grid item xs>
                                                                    <MobileInput
                                                                        value={value}
                                                                        onChange={onChange}
                                                                        StartIcon={StartIcon}
                                                                        popupState={popupState}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Card>
                                                </Transitions>
                                            </>
                                        )}
                                    </PopperStyle>
                                </>
                            )}
                        </PopupState>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <OutlineInputStyle
                            id="input-search-header"
                            value={value}
                            onChange={onChange}
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <StartIcon stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                </InputAdornment>
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight' }}
                        />
                    </Box>
                </>
            ) : (
                <OutlineInputStyle
                    id="input-search-header"
                    value={value}
                    onChange={onChange}
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <StartIcon stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    endAdorment={
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <AvatarStyle color={theme.palette.secondary} variant="rounded">
                                <EndIcon stroke={1.5} size="1.3rem" />
                            </AvatarStyle>
                        </ButtonBase>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{ 'aria-label': 'weight' }}
                />
            )}
        </>
    );
};

StyledInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    StartIcon: PropTypes.element,
    EndIcon: PropTypes.element,
    MobileIcon: PropTypes.element
};

export default StyledInput;
