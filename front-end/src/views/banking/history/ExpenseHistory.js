import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';

const ExpenseHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let [rows, setRows] = useState([]);
    // let [rows] = useState(() => {
    //     let counter = 1;
    //     let temp = userInfo.expenseHistory;
    //     let displayRows = temp.map((item) => {
    //         let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
    //          let row = createData('expense', data);
    //         return { ...row, transNumber: counter++ };
    //     });
    //     return displayRows;
    // });

    let labels = ['Transaction Id', 'Merchant', 'Date', 'Category', 'Price'];
    let emptyMessage = 'Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here';
    let title = 'Expense History';
    let filterInfo = useSelector((state) => state.filter);

    console.log('Your filter info --> ' + filterInfo.location);
    useEffect(() => {
        console.log('Popular --> loc = ' + filterInfo.location + ' cat = ' + filterInfo.category);
        console.log('Running....');
        let expenseHistory = userInfo.expenseHistory;
        let temp = [];
        let counter = 1;
        for (let i = 0; i < expenseHistory.length; i++) {
            if (
                (filterInfo.location === null || expenseHistory[i].location.toLowerCase() === filterInfo.location.toLowerCase()) &&
                (filterInfo.category === null || expenseHistory[i].category.toLowerCase() === filterInfo.category.toLowerCase())
            ) {
                let data = {
                    location: expenseHistory[i].location,
                    date: expenseHistory[i].date,
                    category: expenseHistory[i].category,
                    amount: expenseHistory[i].amount
                };
                let row = createData('expense', data);
                temp.push({ ...row, transNumber: counter++ });
            }
        }
        setRows(temp);
    }, [filterInfo]);

    return <ListCard labels={labels} rows={rows} emptyMessage={emptyMessage} title={title} />;
};

export default ExpenseHistory;
