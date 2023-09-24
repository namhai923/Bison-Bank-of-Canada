import { days, shortMonths } from 'assets/data/timeDisplay';

let sortByTime = (data) => {
    let sortedData = [...data];
    return sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
};

let filterAmountByTime = (type, compareDate, data) => {
    let filtered = sortByTime(data);

    if (type === 'month') {
        filtered = data
            .filter((item) => {
                let date = new Date(item.date);
                return date.getMonth() === compareDate.getMonth() && date.getFullYear() === compareDate.getFullYear();
            })
            .map((item) => item.amount);
    } else {
        filtered = data
            .filter((item) => {
                let date = new Date(item.date);
                if (date.getFullYear() === compareDate.getFullYear()) {
                    return true;
                }
            })
            .map((item) => item.amount);
    }
    return filtered;
};

const getWeekNum = (date) => {
    const janFirst = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - janFirst.getTime()) / 86400000 + janFirst.getDay() + 1) / 7);
};

const isSameWeek = (dateA, dateB) => {
    return getWeekNum(dateA) === getWeekNum(dateB);
};

const twelveHoursDisplay = (date) => {
    if (date.getHours() >= 12) {
        return `${(date.getHours() - 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} PM`;
    } else {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} AM`;
    }
};

const displayTime = (date, type = 'imprecise') => {
    let current = new Date();
    if (date.getDate() === current.getDate()) {
        return twelveHoursDisplay(date);
    } else if (isSameWeek(date, current)) {
        let display = days[date.getDay()];
        if (type === 'precise') {
            display += `, ${twelveHoursDisplay(date)}`;
        }
        return display;
    } else if (date.getFullYear() === current.getFullYear()) {
        let display = `${shortMonths[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
        if (type === 'precise') {
            display += `, ${twelveHoursDisplay(date)}`;
        }
        return display;
    } else {
        let display = `${date.getDate}/${date.getMonth}/${date.getFullYear}`;
        if (type === 'precise') {
            display += `, ${twelveHoursDisplay(date)}`;
        }
        return display;
    }
};

export { sortByTime, filterAmountByTime, displayTime };
