import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import Loader from 'components/Loader';
import ListCard from 'components/cards/ListCard';
import createData from 'utils/createData';
import { useGetTransferQuery } from 'app/features/user/userApiSlice';

const TransferHistory = () => {
    let filterInfo = useSelector((state) => state.filter);
    let token = useSelector((state) => state.auth.token);
    let userName = jwtDecode(token).userName;

    let {
        data: transferHistory,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTransferQuery(userName, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        skip: !token
    });

    let labels = ['Transfer Id', '', 'Receiver/Recipeint', 'Date', 'Amount', ''];
    let filterLabels = [
        { label: 'Sender', color: '#1e88e5' },
        { label: 'Receiver', color: '#5e35b1' }
    ];
    let emptyMessage = 'You have not made or recieved any transfer so far. Send money to your friends to get started!';
    let title = 'Transfer History';

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
                    (filterInfo.sender.length === 0 || filterInfo.sender.includes(item.sender)) &&
                    (filterInfo.receiver.length === 0 || filterInfo.receiver.includes(item.receiver))
                );
            })
            .map((item) => {
                let data = { email: userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
                return createData('transfer', data);
            });
        setRows(displayRows);
    }, [filterInfo, transferHistory, userName]);

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
                filterData={transferHistory}
                filterLabels={filterLabels}
            />
        );
    return content;
};

export default TransferHistory;
