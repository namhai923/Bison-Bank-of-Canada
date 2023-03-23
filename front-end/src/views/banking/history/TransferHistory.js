import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';

const TransferHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let filterInfo = useSelector((state) => state.filter);

    let labels = ['Transfer Id', '', 'Receiver/Recipeint', 'Date', 'Amount', ''];
    let filterLabels = [
        { label: 'Sender', color: '#C22E28' },
        { label: 'Receiver', color: '#F95587' }
    ];
    let emptyMessage = 'You have not made or recieved any transfer so far. Send money to your friends to get started!';
    let title = 'Transfer History';

    let [rows, setRows] = useState(() => {
        let temp = userInfo.transferHistory;
        let displayRows = temp.map((item) => {
            let data = { email: userInfo.userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
            return createData('transfer', data);
        });
        return displayRows;
    });

    useEffect(() => {
        let temp = userInfo.transferHistory;
        let displayRows = temp
            .filter((item) => {
                return (
                    (filterInfo.sender.length === 0 || filterInfo.sender.includes(item.sender)) &&
                    (filterInfo.receiver.length === 0 || filterInfo.receiver.includes(item.receiver))
                );
            })
            .map((item) => {
                let data = { email: userInfo.userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
                return createData('transfer', data);
            });
        setRows(displayRows);
    }, [filterInfo, userInfo]);

    return (
        <ListCard
            labels={labels}
            rows={rows}
            emptyMessage={emptyMessage}
            title={title}
            filterData={userInfo.transferHistory}
            filterLabels={filterLabels}
        />
    );
};

export default TransferHistory;
