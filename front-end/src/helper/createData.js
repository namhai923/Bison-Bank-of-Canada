import { useTheme } from '@mui/material/styles';

export default function useCreateData(merchant, date, category, price) {
    let theme = useTheme();
    let counter = 1;

    let color;
    let background;
    if (price <= 10) {
        (color = theme.palette.primary.light), (background = theme.palette.success.dark);
    } else if (price >= 50) {
        (color = theme.palette.primary.light), (background = theme.palette.error.dark);
    } else {
        (color = theme.palette.primary.light), (background = theme.palette.warning.dark);
    }
    if (price % 1 == 0) {
        price = price + '.00';
    }
    let dateArray = date.split('-');
    console.assert(dateArray.length == 3);
    dateArray[2] = dateArray[2].split('T')[0];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    date = months[Number(dateArray[1] - 1)] + ' ' + dateArray[2] + ', ' + dateArray[0];
    let transNumber = counter;
    counter = counter + 1;
    price = '$' + price;
    return { transNumber, merchant, date, category, price, color, background };
}
