import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';

const ExpenseHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let filterInfo = useSelector((state) => state.filter);

    let labels = ['Expense Id', 'Merchant', 'Date', 'Category', 'Price'];
    let filterLabels = [
        { label: 'Location', color: '#6390F0' },
        { label: 'Category', color: '#6F35FC' }
    ];
    let emptyMessage = 'Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here';
    let title = 'Expense History';

    let [rows, setRows] = useState(() => {
        let counter = 1;
        let temp = userInfo.expenseHistory;
        let displayRows = temp.map((item) => {
            let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
            let row = createData('expense', data);
            return { ...row, transNumber: counter++ };
        });
        return displayRows;
    });

    useEffect(() => {
        let counter = 1;
        let temp = userInfo.expenseHistory;
        let displayRows = temp
            .filter((item) => {
                return (
                    (filterInfo.location.length === 0 || filterInfo.location.includes(item.location)) &&
                    (filterInfo.category.length === 0 || filterInfo.category.includes(item.category))
                );
            })
            .map((item) => {
                let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
                let row = createData('expense', data);
                return { ...row, transNumber: counter++ };
            });
        setRows(displayRows);
    }, [filterInfo, userInfo]);

    return (
        <ListCard
            labels={labels}
            rows={rows}
            emptyMessage={emptyMessage}
            title={title}
            filterData={userInfo.expenseHistory}
            filterLabels={filterLabels}
        />
    );
};

export default ExpenseHistory;
