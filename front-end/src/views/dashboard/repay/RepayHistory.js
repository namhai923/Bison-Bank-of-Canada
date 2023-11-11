import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from 'components/cards/TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const RepayHistory = (props) => {
    let { data } = props;

    let repayHistoryEmails = useSelector((state) => state.filter.repayHistoryEmails);
    let repayHistoryDateFrom = useSelector((state) => state.filter.repayHistoryDateFrom);
    let repayHistoryDateTo = useSelector((state) => state.filter.repayHistoryDateTo);
    let repayHistoryAmountFrom = useSelector((state) => state.filter.repayHistoryAmountFrom);
    let repayHistoryAmountTo = useSelector((state) => state.filter.repayHistoryAmountTo);

    let headLabels = [
        { id: 'send', label: 'Send/Receive', alignRight: false },
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: 'accepted', label: 'Status', alignRight: false },
        { id: '' }
    ];
    let filterData = [
        { label: 'Email/Username', name: 'repayHistoryEmails', type: 'emails' },
        { label: 'Date', name: 'repayHistoryDate', type: 'date' },
        { label: 'Amount', name: 'repayHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (repayHistoryEmails.length === 0 || repayHistoryEmails.includes(item.userName)) &&
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
            tableMinWidth={650}
        />
    );
};

RepayHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default RepayHistory;
