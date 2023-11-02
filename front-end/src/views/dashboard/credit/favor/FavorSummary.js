import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from 'components/cards/TableCard';
import { numberInRange } from 'utils/inRangeFilter';

const FavorSummary = (props) => {
    let { data } = props;

    let favorSummaryEmails = useSelector((state) => state.filter.favorSummaryEmails);
    let favorSummaryAmountFrom = useSelector((state) => state.filter.favorSummaryAmountFrom);
    let favorSummaryAmountTo = useSelector((state) => state.filter.favorSummaryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: true }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'favorSummaryEmails', type: 'emails' },
        { label: 'Amount', name: 'favorSummaryAmount', type: 'amount' }
    ];

    let displayData = data.summary.filter((item) => {
        return (
            (favorSummaryEmails.length === 0 || favorSummaryEmails.includes(item.userName)) &&
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
            tableMinWidth={200}
        />
    );
};

FavorSummary.propTypes = {
    data: PropTypes.object
};

export default FavorSummary;
