import sortByTime from './sortByTime';

export default function currentData(type, data) {
    let currentData = sortByTime(data);

    if (type === 'month') {
        currentData = data
            .filter((item) => {
                let date = new Date(item.date);
                let current = new Date();
                if (date.getMonth() === current.getMonth() && date.getFullYear() === current.getFullYear()) {
                    return true;
                }
            })
            .map((item) => item.amount);
    } else {
        currentData = data
            .filter((item) => {
                let date = new Date(item.date);
                let current = new Date();
                if (date.getFullYear() === current.getFullYear()) {
                    return true;
                }
            })
            .map((item) => item.amount);
    }
    return currentData;
}
