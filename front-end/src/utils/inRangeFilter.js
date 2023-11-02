import moment from 'moment/moment';

export const numberInRange = (min, max, item) => {
    return (
        (min === 0 && max === 0) ||
        (min !== 0 && max === 0 && min <= item) ||
        (min === 0 && max !== 0 && item <= max) ||
        (min <= item && item <= max)
    );
};

export const dateInRange = (startDate, endDate, date) => {
    return (
        (startDate === null && endDate === null) ||
        (startDate !== null && endDate === null && moment(date).isSameOrAfter(moment(startDate), 'day')) ||
        (startDate === null && endDate !== null && moment(date).isSameOrBefore(moment(endDate), 'day')) ||
        (moment(date).isSameOrAfter(moment(startDate), 'day') && moment(date).isSameOrBefore(moment(endDate), 'day'))
    );
};
