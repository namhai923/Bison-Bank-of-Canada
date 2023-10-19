import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from '../TableCard';
import { numberInRange } from 'utils/inRangeFilter';

const DebtSummary = (props) => {
    let { data } = props;

    let debtSummaryUserName = useSelector((state) => state.value.debtSummaryUserName);
    let debtSummaryAmountFrom = useSelector((state) => state.value.debtSummaryAmountFrom);
    let debtSummaryAmountTo = useSelector((state) => state.value.debtSummaryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: true }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'debtSummaryUserName', type: 'userName' },
        { label: 'Amount', name: 'debtSummaryAmount', type: 'amount' }
    ];

    let displayData = data.summary.filter((item) => {
        return (
            (debtSummaryUserName.length === 0 || debtSummaryUserName.includes(item.userName)) &&
            numberInRange(Number(debtSummaryAmountFrom), Number(debtSummaryAmountTo), item.amount)
        );
    });

    return (
        <TableCard
            title="Debt Summary"
            headLabels={headLabels}
            data={data.summary}
            displayData={displayData}
            filterData={filterData}
            emptyMessage="You have no debt summary record!"
            emptyFilterMessage="No debt summary match your filter!"
        />
    );
};

DebtSummary.propTypes = {
    data: PropTypes.object
};

export default DebtSummary;
