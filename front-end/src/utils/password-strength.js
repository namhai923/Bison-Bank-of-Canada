/**
 * Password validator for login pages
 */
import value from 'assets/scss/_themes-vars.module.scss';

// has number
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number) => new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);
const defLen = 85;
const lenIncrement = 20;

// set color based on password strength
export const strengthColor = (count) => {
    if (count === 1) return { label: 'Poor', color: value.errorMain, length: defLen };
    if (count === 2) return { label: 'Weak', color: value.warningDark, length: defLen + lenIncrement };
    if (count === 3) return { label: 'Normal', color: value.orangeMain, length: defLen + 2 * lenIncrement };
    if (count === 4) return { label: 'Good', color: value.successMain, length: defLen + 3 * lenIncrement };
    if (count === 5) return { label: 'Strong', color: value.successDark, length: defLen + 4 * lenIncrement };
    return { label: 'Poor', color: value.errorMain, length: defLen };
};

// password strength indicator
export const strengthIndicator = (number) => {
    let strengths = 0;
    if (number.length >= 8) strengths += 1;
    if (number.length >= 10) strengths += 1;
    if (hasNumber(number)) strengths += 1;
    if (hasSpecial(number)) strengths += 1;
    if (hasMixed(number)) strengths += 1;
    return strengths;
};
