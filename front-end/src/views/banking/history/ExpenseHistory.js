import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';

const ExpenseHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let [rows, setRows] = useState([]);

    useEffect(() => {
        let counter = 1;
        let temp = userInfo.expenseHistory;
        let displayRows = temp.map((item) => {
            let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
            let row = createData('expense', data);
            return { ...row, transNumber: counter++ };
        });
        setRows(displayRows);
    }, [userInfo]);

    let labels = ['Transaction Id', 'Merchant', 'Date', 'Category', 'Price'];
    let emptyMessage = 'Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here';
    let title = 'Expense History';

    return <ListCard labels={labels} rows={rows} emptyMessage={emptyMessage} title={title} />;
};

export default ExpenseHistory;
