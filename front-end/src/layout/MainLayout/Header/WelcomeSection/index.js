import PropTypes from 'prop-types';

import longTextDisplay from 'utils/longTextDisplay';

const WelcomeMessage = (props) => {
    let { firstName } = props;

    return <h1 style={{ paddingLeft: '25px' }}>{`Welcome, ${longTextDisplay(firstName, 13)}!`}</h1>;
};

WelcomeMessage.propTypes = {
    firstName: PropTypes.string
};

export default WelcomeMessage;
