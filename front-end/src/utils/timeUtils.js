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

export { sortByTime, filterAmountByTime };
