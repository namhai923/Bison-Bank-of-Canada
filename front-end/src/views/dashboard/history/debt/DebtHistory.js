import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from '../TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const DebtHistory = (props) => {
    let { data } = props;

    let debtHistoryUserName = useSelector((state) => state.value.debtHistoryUserName);
    let debtHistoryDateFrom = useSelector((state) => state.value.debtHistoryDateFrom);
    let debtHistoryDateTo = useSelector((state) => state.value.debtHistoryDateTo);
    let debtHistoryAmountFrom = useSelector((state) => state.value.debtHistoryAmountFrom);
    let debtHistoryAmountTo = useSelector((state) => state.value.debtHistoryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: '' }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'debtHistoryUserName', type: 'userName' },
        { label: 'Date', name: 'debtHistoryDate', type: 'date' },
        { label: 'Amount', name: 'debtHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (debtHistoryUserName.length === 0 || debtHistoryUserName.includes(item.userName)) &&
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
        />
    );
};

DebtHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default DebtHistory;
