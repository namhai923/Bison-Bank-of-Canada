export default function createData(merchant, date, category, price) {
    let color;
    let background;
    if (price <= 10) {
        (color = '#fff'), (background = '#ffc107');
    } else if (price >= 50) {
        (color = '#fff'), (background = '#f44336');
    } else {
        (color = '#fff'), (background = '#ffc107');
    }
    if (price % 1 == 0) {
        price = price + '.00';
    }
    let dateArray = date.split('-');
    console.assert(dateArray.length == 3);
    dateArray[2] = dateArray[2].split('T')[0];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    date = months[Number(dateArray[1] - 1)] + ' ' + dateArray[2] + ', ' + dateArray[0];
    price = '$' + price;
    return { merchant, date, category, price, color, background };
}
