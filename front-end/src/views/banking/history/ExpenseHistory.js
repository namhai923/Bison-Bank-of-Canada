import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';

import Loader from 'components/Loader';
import HistoryCard from './HistoryCard';
import createData from 'utils/createData';
import { useGetExpenseQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const ExpenseHistory = () => {
    let selectInfo = useSelector((state) => state.value);
    let theme = useTheme();

    let {
        data: expenseHistory,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetExpenseQuery('expenseHistory', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let title = 'Expense History';
    let labels = ['Expense Id', 'Merchant', 'Date', 'Category', 'Amount', ''];
    let filterLabels = [
        { label: 'Location', color: theme.palette.primary.main },
        { label: 'Category', color: theme.palette.secondary.main }
    ];
    let emptyMessage = 'Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here';
    let emptyFilterMessage = 'No Expense Match Your Filter';

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
                    (selectInfo.location.length === 0 || selectInfo.location.includes(item.location)) &&
                    (selectInfo.category.length === 0 || selectInfo.category.includes(item.category))
                );
            })
            .map((item) => {
                let data = { location: item.location, date: item.date, category: item.category, amount: item.amount };
                return createData('expense', data);
            });
        setRows(displayRows);
    }, [selectInfo, expenseHistory]);

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess)
        content = (
            <HistoryCard
                title={title}
                labels={labels}
                rows={rows}
                emptyMessage={emptyMessage}
                emptyFilterMessage={emptyFilterMessage}
                filterLabels={filterLabels}
                filterData={expenseHistory}
            />
        );
    return content;
};

export default ExpenseHistory;
