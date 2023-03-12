import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';

const TransferHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let [rows, setRows] = useState([]);

    useEffect(() => {
        let counter = 1;
        let temp = userInfo.transferHistory;
        let displayRows = temp.map((item) => {
            let data = { email: userInfo.userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
            let row = createData('transfer', data);
            return { ...row, transNumber: counter++ };
        });
        setRows(displayRows);
    }, [userInfo]);

    let labels = ['Transfer Id', ' ', 'Receiver/Recipeint', 'Date', 'Amount'];
    let emptyMessage = 'You have not made or recieved any transfer so far. Send money to your friends to get started!';
    let title = 'Transfer History';

    return <ListCard labels={labels} rows={rows} emptyMessage={emptyMessage} title={title} />;
};

export default TransferHistory;
