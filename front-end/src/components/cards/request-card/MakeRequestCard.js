import PropTypes from 'prop-types';

import MainCard from 'components/cards/MainCard';
import MakeRequestForm from './MakeRequestForm';

const MakeRequestCard = (props) => {
    let { title, name, handleSubmit } = props;

    return (
        <MainCard title={title}>
            <MakeRequestForm name={name} handleSubmit={handleSubmit}></MakeRequestForm>
        </MainCard>
    );
};

MakeRequestCard.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    handleSubmit: PropTypes.func
};

export default MakeRequestCard;
