import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import { Toolbar, Typography, Grid } from '@mui/material';

import { IconListSearch } from '@tabler/icons-react';

import StyledInput from 'components/styled-input';
import UtilityBar from 'components/utility-bar/UtilityBar';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

const ContactsListToolbar = (props) => {
    let { selected, filterName, onFilterName, handleRemoveContacts } = props;

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
                        <UtilityBar
                            multipleValues={selected}
                            favorRequest
                            repayRequest
                            handleRemoveContacts={handleRemoveContacts}
                        ></UtilityBar>
                    </Grid>
                </>
            ) : (
                <StyledInput value={filterName} onChange={onFilterName} placeholder="Search contact" StartIcon={IconListSearch} />
            )}
        </StyledRoot>
    );
};

ContactsListToolbar.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string),
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    handleFavorRequest: PropTypes.func,
    handleRepayRequest: PropTypes.func,
    handleRemoveContacts: PropTypes.func
};

export default ContactsListToolbar;
