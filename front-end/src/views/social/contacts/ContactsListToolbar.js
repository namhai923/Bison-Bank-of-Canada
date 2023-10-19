import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { IconTrash, IconCoins, IconListSearch } from '@tabler/icons-react';

import StyledInput from 'components/styled-input';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

const ContactsListToolbar = (props) => {
    let { selected, filterName, onFilterName, handleTransfer, handleRemoveContacts } = props;
    let theme = useTheme();

    return (
        <StyledRoot
            sx={{
                ...(selected.length > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                })
            }}
        >
            {selected.length > 0 ? (
                <>
                    <Typography component="div" variant="subtitle1">
                        {selected.length} selected
                    </Typography>
                    <Grid>
                        <Tooltip title="Transfer">
                            <IconButton onClick={() => handleTransfer(selected)}>
                                <IconCoins stroke={1.5} size="1.3rem" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove contact">
                            <IconButton onClick={() => handleRemoveContacts(selected)}>
                                <IconTrash stroke={1.5} size="1.3rem" color={theme.palette.error.dark} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </>
            ) : (
                <StyledInput
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search contact"
                    StartIcon={IconListSearch}
                    MobileIcon={IconListSearch}
                />
            )}
        </StyledRoot>
    );
};

ContactsListToolbar.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string),
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    handleTransfer: PropTypes.func,
    handleRemoveContacts: PropTypes.func
};

export default ContactsListToolbar;
