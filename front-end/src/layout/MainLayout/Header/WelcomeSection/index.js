import PropTypes from 'prop-types';

const WelcomeMessage = (props) => {
    let { firstName } = props;

    return <h1 style={{ paddingLeft: '25px' }}> Welcome, {firstName}!</h1>;
};

WelcomeMessage.propTypes = {
    firstName: PropTypes.string
};

export default WelcomeMessage;
