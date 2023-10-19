import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from '../TableCard';
import { numberInRange } from 'utils/inRangeFilter';

const FavorSummary = (props) => {
    let { data } = props;

    let favorSummaryUserName = useSelector((state) => state.value.favorSummaryUserName);
    let favorSummaryAmountFrom = useSelector((state) => state.value.favorSummaryAmountFrom);
    let favorSummaryAmountTo = useSelector((state) => state.value.favorSummaryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: true }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'favorSummaryUserName', type: 'userName' },
        { label: 'Amount', name: 'favorSummaryAmount', type: 'amount' }
    ];

    let displayData = data.summary.filter((item) => {
        return (
            (favorSummaryUserName.length === 0 || favorSummaryUserName.includes(item.userName)) &&
            numberInRange(Number(favorSummaryAmountFrom), Number(favorSummaryAmountTo), item.amount)
        );
    });

    return (
        <TableCard
            title="Favor Summary"
            headLabels={headLabels}
            data={data.summary}
            displayData={displayData}
            filterData={filterData}
            emptyMessage="You have no favor summary record!"
            emptyFilterMessage="No favor summary match your filter!"
        />
    );
};

FavorSummary.propTypes = {
    data: PropTypes.object
};

export default FavorSummary;
