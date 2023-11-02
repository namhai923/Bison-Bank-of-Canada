import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';
import { IconTrash, IconMessageCircle, IconHeartDollar, IconReceiptRefund, IconPlus } from '@tabler/icons-react';

import { setValue } from 'app/features/value/valueSlice';
import { addEmails } from 'app/features/request/requestSlice';
import { openMenu } from 'app/features/customize/customizeSlice';

const UtilityBar = (props) => {
    let { singleValue, multipleValues, sendMessage, favorRequest, repayRequest, handleRemoveContacts, handleAddContact } = props;
    let theme = useTheme();

    let dispatch = useDispatch();
    let navigate = useNavigate();

    let handleMessage = (selectedUser) => {
        dispatch(setValue({ type: 'currentConversation', value: selectedUser }));
        dispatch(openMenu('messenger'));
        navigate('/messenger');
    };

    let handleFavorRequest = (selectedContacts) => {
        dispatch(addEmails({ type: 'favorRequestEmails', value: selectedContacts }));
        dispatch(openMenu('favor'));
        navigate('/credit/favor');
    };

    let handleRepayRequest = (selectedContacts) => {
        dispatch(addEmails({ type: 'repayRequestEmails', value: selectedContacts }));
        dispatch(openMenu('repay'));
        navigate('/repay');
    };

    return (
        <>
            {sendMessage && (
                <Tooltip title="Send message">
                    <IconButton onClick={() => handleMessage(singleValue)}>
                        <IconMessageCircle stroke={1.5} size="1.3rem" />
                    </IconButton>
                </Tooltip>
            )}
            {favorRequest && (
                <Tooltip title="Request favor">
                    <IconButton onClick={() => handleFavorRequest(multipleValues)}>
                        <IconHeartDollar stroke={1.5} size="1.3rem" />
                    </IconButton>
                </Tooltip>
            )}
            {repayRequest && (
                <Tooltip title="Request repay">
                    <IconButton onClick={() => handleRepayRequest(multipleValues)}>
                        <IconReceiptRefund stroke={1.5} size="1.3rem" />
                    </IconButton>
                </Tooltip>
            )}
            {handleRemoveContacts && (
                <Tooltip title="Remove contact">
                    <IconButton onClick={() => handleRemoveContacts(multipleValues)}>
                        <IconTrash stroke={1.5} size="1.3rem" color={theme.palette.error.dark} />
                    </IconButton>
                </Tooltip>
            )}
            {handleAddContact && (
                <Tooltip title="Add Contact">
                    <IconButton onClick={() => handleAddContact(singleValue)}>
                        <IconPlus stroke={1.5} size="1.3rem" color={theme.palette.secondary.dark} />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
};

UtilityBar.propTypes = {
    singleValue: PropTypes.string,
    multipleValues: PropTypes.arrayOf(PropTypes.string),
    sendMessage: PropTypes.bool,
    favorRequest: PropTypes.bool,
    repayRequest: PropTypes.bool,
    handleRemoveContacts: PropTypes.func,
    handleAddContact: PropTypes.func
};

export default UtilityBar;
