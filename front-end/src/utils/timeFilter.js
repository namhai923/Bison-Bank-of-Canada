const timeFilter = (type, compareDate, data) => {
    let filtered;

    if (type === 'month') {
        filtered = data
            .filter((item) => {
                let date = new Date(item.updatedAt);
                return date.getMonth() === compareDate.getMonth() && date.getFullYear() === compareDate.getFullYear();
            })
            .map((item) => item.amount);
    } else {
        filtered = data
            .filter((item) => {
                let date = new Date(item.updatedAt);
                if (date.getFullYear() === compareDate.getFullYear()) {
                    return true;
                }
            })
            .map((item) => item.amount);
    }
    return filtered;
};

export default timeFilter;
