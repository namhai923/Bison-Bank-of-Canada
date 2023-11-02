import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from 'components/cards/TableCard';
import { numberInRange } from 'utils/inRangeFilter';

const DebtSummary = (props) => {
    let { data } = props;

    let debtSummaryEmails = useSelector((state) => state.filter.debtSummaryEmails);
    let debtSummaryAmountFrom = useSelector((state) => state.filter.debtSummaryAmountFrom);
    let debtSummaryAmountTo = useSelector((state) => state.filter.debtSummaryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: true }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'debtSummaryEmails', type: 'emails' },
        { label: 'Amount', name: 'debtSummaryAmount', type: 'amount' }
    ];

    let displayData = data.summary.filter((item) => {
        return (
            (debtSummaryEmails.length === 0 || debtSummaryEmails.includes(item.userName)) &&
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
            tableMinWidth={200}
        />
    );
};

DebtSummary.propTypes = {
    data: PropTypes.object
};

export default DebtSummary;
