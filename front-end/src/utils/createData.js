import { KeyboardArrowUpOutlined, KeyboardArrowDownOutlined } from '@mui/icons-material';

export default function createData(type, data) {
    let color;
    let icon;

    let { date, amount } = data;

    if (amount <= 10) {
        color = 'success';
    } else if (amount >= 50) {
        color = 'error';
    } else {
        color = 'warning';
    }

    if (type === 'expense') {
        let { location, category } = data;

        icon = KeyboardArrowDownOutlined;
        return { data: { merchant: location, date, category, amount }, display: { color, icon } };
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
        return { data: { senderOrReceiver, otherPerson, date, amount }, display: { color, icon } };
    }
}
