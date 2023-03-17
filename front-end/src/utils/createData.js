import months from 'assets/data/months';
import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined } from '@mui/icons-material';

export default function createData(type, data) {
    let color;
    let background;
    let icon;

    let { date, amount } = data;

    if (amount <= 10) {
        (color = '#fff'), (background = '#4caf50');
    } else if (amount >= 50) {
        (color = '#fff'), (background = '#f44336');
    } else {
        (color = '#fff'), (background = '#ffc107');
    }
    if (amount % 1 == 0) {
        amount = amount + '.00';
    }

    let dateData = new Date(date);
    date = months[dateData.getMonth()] + ' ' + dateData.getDate() + ', ' + dateData.getFullYear();
    amount = '$' + amount;

    if (type === 'expense') {
        let { location, category } = data;

        icon = KeyboardArrowDownOutlined;
        return { data: { merchant: location, date, category, price: amount }, display: { color, background, icon } };
    } else {
        let senderOrReceiver;
        let otherPerson;
        let { email, sender, receiver } = data;

        if (email == sender) {
            senderOrReceiver = 'Sent to:';
            otherPerson = receiver;
            icon = KeyboardArrowDownOutlined;
        } else if (email == receiver) {
            senderOrReceiver = 'Received from:';
            otherPerson = sender;
            icon = KeyboardArrowUpOutlined;
        } else {
            senderOrReceiver = 'Unknown';
            otherPerson = 'Unknown';
        }
        return { data: { senderOrReceiver, otherPerson, date, amount }, display: { color, background, icon } };
    }
}
