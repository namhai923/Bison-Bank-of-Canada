import PropTypes from 'prop-types';

import MainCard from 'components/cards/MainCard';
import MakeRequestForm from './MakeRequestForm';

const MakeRequestCard = (props) => {
    let { title, handleSubmit } = props;

    return (
        <MainCard title={title}>
            <MakeRequestForm handleSubmit={handleSubmit}></MakeRequestForm>
        </MainCard>
    );
};

MakeRequestCard.propTypes = {
    title: PropTypes.string,
    handleSubmit: PropTypes.func
};

export default MakeRequestCard;
