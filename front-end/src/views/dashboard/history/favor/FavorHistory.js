import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import TableCard from '../TableCard';
import { numberInRange, dateInRange } from 'utils/inRangeFilter';

const FavorHistory = (props) => {
    let { data } = props;

    let favorHistoryUserName = useSelector((state) => state.value.favorHistoryUserName);
    let favorHistoryDateFrom = useSelector((state) => state.value.favorHistoryDateFrom);
    let favorHistoryDateTo = useSelector((state) => state.value.favorHistoryDateTo);
    let favorHistoryAmountFrom = useSelector((state) => state.value.favorHistoryAmountFrom);
    let favorHistoryAmountTo = useSelector((state) => state.value.favorHistoryAmountTo);

    let headLabels = [
        { id: 'userName', label: 'Email/Username', alignRight: false },
        { id: 'createdAt', label: 'Date', alignRight: false },
        { id: 'amount', label: 'Amount', alignRight: false },
        { id: 'accepted', label: 'Status', alignRight: false },
        { id: '' }
    ];

    let filterData = [
        { label: 'Email/Username', name: 'favorHistoryUserName', type: 'userName' },
        { label: 'Date', name: 'favorHistoryDate', type: 'date' },
        { label: 'Amount', name: 'favorHistoryAmount', type: 'amount' }
    ];

    let displayData = data.filter((item) => {
        return (
            (favorHistoryUserName.length === 0 || favorHistoryUserName.includes(item.userName)) &&
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
        />
    );
};

FavorHistory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default FavorHistory;
