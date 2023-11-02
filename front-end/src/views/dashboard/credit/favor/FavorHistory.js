import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from 'components/cards/TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const FavorHistory = (props) => {
    let { data } = props;

    let favorHistoryEmails = useSelector((state) => state.filter.favorHistoryEmails);
    let favorHistoryDateFrom = useSelector((state) => state.filter.favorHistoryDateFrom);
    let favorHistoryDateTo = useSelector((state) => state.filter.favorHistoryDateTo);
    let favorHistoryAmountFrom = useSelector((state) => state.filter.favorHistoryAmountFrom);
    let favorHistoryAmountTo = useSelector((state) => state.filter.favorHistoryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: 'accepted', label: 'Status', alignRight: false },
        { id: '' }
    ];

    let filterData = [
        { label: 'Email/Username', name: 'favorHistoryEmails', type: 'emails' },
        { label: 'Date', name: 'favorHistoryDate', type: 'date' },
        { label: 'Amount', name: 'favorHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (favorHistoryEmails.length === 0 || favorHistoryEmails.includes(item.userName)) &&
            dateInRange(favorHistoryDateFrom, favorHistoryDateTo, item.createdAt) &&
            numberInRange(Number(favorHistoryAmountFrom), Number(favorHistoryAmountTo), item.amount)
        );
    });

    return (
        <TableCard
            title="Favor History"
            headLabels={headLabels}
            data={data}
            displayData={displayData}
            filterData={filterData}
            emptyMessage="You have no favor record!"
            emptyFilterMessage="No favor match your filter!"
            tableMinWidth={500}
        />
    );
};

FavorHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default FavorHistory;
