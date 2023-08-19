import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import Loader from 'components/Loader';
import ListCard from 'components/cards/ListCard';
import createData from 'utils/createData';
import { useGetExpenseQuery } from 'app/features/user/userApiSlice';

const ExpenseHistory = () => {
    let filterInfo = useSelector((state) => state.filter);
    let token = useSelector((state) => state.auth.token);

    let {
        data: expenseHistory,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExpenseQuery(jwtDecode(token).userName, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !token
    });

    let labels = ['Expense Id', 'Merchant', 'Date', 'Category', 'Amount', ''];
    let filterLabels = [
        { label: 'Location', color: '#6390F0' },
        { label: 'Category', color: '#6F35FC' }
    ];
    let emptyMessage = 'Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here';
    let title = 'Expense History';

    let [rows, setRows] = useState(() => {
        let temp = expenseHistory;
        let displayRows = temp.map((item) => {
            let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
            return createData('expense', data);
        });
        return displayRows;
    });

    useEffect(() => {
        let temp = expenseHistory;
        let displayRows = temp
            .filter((item) => {
                return (
                    (filterInfo.location.length === 0 || filterInfo.location.includes(item.location)) &&
                    (filterInfo.category.length === 0 || filterInfo.category.includes(item.category))
                );
            })
            .map((item) => {
                let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
                return createData('expense', data);
            });
        setRows(displayRows);
    }, [filterInfo, expenseHistory]);

    let content;
    if (isLoading) content = <Loader></Loader>;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess)
        content = (
            <ListCard
                labels={labels}
                rows={rows}
                emptyMessage={emptyMessage}
                title={title}
                filterData={expenseHistory}
                filterLabels={filterLabels}
            />
        );
    return content;
};

export default ExpenseHistory;
