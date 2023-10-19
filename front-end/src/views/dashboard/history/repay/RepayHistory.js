import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from '../TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const RepayHistory = (props) => {
    let { data } = props;

    let repayHistoryUserName = useSelector((state) => state.value.repayHistoryUserName);
    let repayHistoryDateFrom = useSelector((state) => state.value.repayHistoryDateFrom);
    let repayHistoryDateTo = useSelector((state) => state.value.repayHistoryDateTo);
    let repayHistoryAmountFrom = useSelector((state) => state.value.repayHistoryAmountFrom);
    let repayHistoryAmountTo = useSelector((state) => state.value.repayHistoryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: 'accepted', label: 'Status', alignRight: false },
        { id: '' }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'repayHistoryUserName', type: 'userName' },
        { label: 'Date', name: 'repayHistoryDate', type: 'date' },
        { label: 'Amount', name: 'repayHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (repayHistoryUserName.length === 0 || repayHistoryUserName.includes(item.userName)) &&
            dateInRange(repayHistoryDateFrom, repayHistoryDateTo, item.createdAt) &&
            numberInRange(Number(repayHistoryAmountFrom), Number(repayHistoryAmountTo), item.amount)
        );
    });

    return (
        <TableCard
            title="Repay History"
            headLabels={headLabels}
            data={data}
            displayData={displayData}
            filterData={filterData}
            emptyMessage="You have no repay record!"
            emptyFilterMessage="No repay match your filter!"
        />
    );
};

RepayHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default RepayHistory;
