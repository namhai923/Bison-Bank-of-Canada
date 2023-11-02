import PropTypes from 'prop-types';

import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper } from '@mui/material';

import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

import Transitions from 'components/extended/Transitions';

import { IconX } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';

const PopperStyle = styled(Popper, { shouldForwardProp })(() => ({
    zIndex: 1100,
    width: '99%',
    top: '-55px !important'
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

const MobileInput = (props) => {
    let { value, onChange, endButtonClick, placeholder, StartIcon, EndIcon, popupState } = props;
    const theme = useTheme();

    return (
        <OutlineInputStyle
            id="input-search-header"
            value={value}
            onChange={onChange}
            autoComplete="off"
            placeholder={placeholder}
            startAdornment={
                <InputAdornment position="start">
                    <StartIcon stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    {EndIcon && (
                        <ButtonBase sx={{ borderRadius: '12px' }} onClick={endButtonClick}>
                            <AvatarStyle color={theme.palette.secondary} variant="rounded">
                                <EndIcon stroke={1.5} size="1.3rem" />
                            </AvatarStyle>
                        </ButtonBase>
                    )}
                    <Box sx={{ ml: 2 }}>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <AvatarStyle variant="rounded" color={theme.palette.orange} {...bindToggle(popupState)}>
                                <IconX stroke={1.5} size="1.3rem" />
                            </AvatarStyle>
                        </ButtonBase>
                    </Box>
                </InputAdornment>
            }
        />
    );
};

MobileInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    endButtonClick: PropTypes.func,
    placeholder: PropTypes.string,
    StartIcon: PropTypes.object,
    EndIcon: PropTypes.object,
    popupState: PopupState
};

const StyledInput = (props) => {
    let { value, onChange, endButtonClick, placeholder, StartIcon, EndIcon, MobileIcon } = props;
    const theme = useTheme();

    return (
        <>
            {MobileIcon && (
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
                                                                    placeholder={placeholder}
                                                                    StartIcon={StartIcon}
                                                                    EndIcon={EndIcon}
                                                                    endButtonClick={endButtonClick}
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
            )}
            <Box sx={{ display: MobileIcon && { xs: 'none', md: 'block' } }}>
                <OutlineInputStyle
                    id="input-search-header"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    startAdornment={
                        StartIcon && (
                            <InputAdornment position="start">
                                <StartIcon stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        EndIcon && (
                            <ButtonBase sx={{ borderRadius: '12px' }} onClick={endButtonClick}>
                                <AvatarStyle color={theme.palette.secondary} variant="rounded">
                                    <EndIcon stroke={1.5} size="1.3rem" />
                                </AvatarStyle>
                            </ButtonBase>
                        )
                    }
                />
            </Box>
        </>
    );
};

StyledInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    endButtonClick: PropTypes.func,
    placeholder: PropTypes.string,
    StartIcon: PropTypes.object,
    EndIcon: PropTypes.object,
    MobileIcon: PropTypes.object
};

export default StyledInput;
