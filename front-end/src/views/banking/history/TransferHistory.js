import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import { useTheme } from '@mui/material/styles';

import Loader from 'components/Loader';
import HistoryCard from './HistoryCard';
import createData from 'utils/createData';
import { useGetTransferQuery } from 'app/features/user/userApiSlice';
import config from 'assets/data/config';

const TransferHistory = () => {
    let theme = useTheme();

    let token = useSelector((state) => state.auth.token);
    let userName = jwtDecode(token).userName;

    let {
        data: transferHistory,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTransferQuery('transferHistory', {
        pollingInterval: config.pollingInterval,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let selectInfo = useSelector((state) => state.value);

    let [rows, setRows] = useState(() => {
        let temp = transferHistory;
        let displayRows = temp.map((item) => {
            let data = { email: userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
            return createData('transfer', data);
        });
        return displayRows;
    });

    useEffect(() => {
        let temp = transferHistory;
        let displayRows = temp
            .filter((item) => {
                return (
                    (selectInfo.sender.length === 0 || selectInfo.sender.includes(item.sender)) &&
                    (selectInfo.receiver.length === 0 || selectInfo.receiver.includes(item.receiver))
                );
            })
            .map((item) => {
                let data = {
                    email: userName,
                    date: item.date,
                    sender: item.sender,
                    receiver: item.receiver,
                    amount: item.amount
                };
                return createData('transfer', data);
            });
        setRows(displayRows);
    }, [selectInfo, transferHistory, userName]);

    let content;
    if (isLoading) content = <Loader />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }
    if (isSuccess) {
        let title = 'Transfer History';
        let labels = ['Transfer Id', '', 'Receiver/Recipeint', 'Date', 'Amount', ''];
        let filterLabels = [
            { label: 'Sender', color: theme.palette.primary.main },
            { label: 'Receiver', color: theme.palette.secondary.main }
        ];
        let emptyMessage = 'You have not made or recieved any transfer so far. Send money to your friends to get started!';
        let emptyFilterMessage = 'No Transfer Match Your Filter';

        content = (
            <HistoryCard
                title={title}
                labels={labels}
                rows={rows}
                emptyMessage={emptyMessage}
                emptyFilterMessage={emptyFilterMessage}
                filterLabels={filterLabels}
                filterData={transferHistory}
            />
        );
    }
    return content;
};

export default TransferHistory;
