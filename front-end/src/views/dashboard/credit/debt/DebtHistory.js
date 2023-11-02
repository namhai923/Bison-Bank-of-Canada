import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from 'components/cards/TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const DebtHistory = (props) => {
    let { data } = props;

    let debtHistoryEmails = useSelector((state) => state.filter.debtHistoryEmails);
    let debtHistoryDateFrom = useSelector((state) => state.filter.debtHistoryDateFrom);
    let debtHistoryDateTo = useSelector((state) => state.filter.debtHistoryDateTo);
    let debtHistoryAmountFrom = useSelector((state) => state.filter.debtHistoryAmountFrom);
    let debtHistoryAmountTo = useSelector((state) => state.filter.debtHistoryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: '' }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'debtHistoryEmails', type: 'emails' },
        { label: 'Date', name: 'debtHistoryDate', type: 'date' },
        { label: 'Amount', name: 'debtHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (debtHistoryEmails.length === 0 || debtHistoryEmails.includes(item.userName)) &&
            dateInRange(debtHistoryDateFrom, debtHistoryDateTo, item.createdAt) &&
            numberInRange(Number(debtHistoryAmountFrom), Number(debtHistoryAmountTo), item.amount)
        );
    });

    return (
        <TableCard
            title="Debt History"
            headLabels={headLabels}
            data={data}
            displayData={displayData}
            filterData={filterData}
            emptyMessage="You have no debt record!"
            emptyFilterMessage="No debt match your filter!"
            tableMinWidth={500}
        />
    );
};

DebtHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default DebtHistory;
