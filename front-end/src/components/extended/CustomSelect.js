import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import chroma from 'chroma-js';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { InputLabel, useTheme } from '@mui/material';

import { setFilter } from 'app/features/filter/filterSlice';

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled ? null : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
            color: isDisabled ? '#ccc' : isSelected ? (chroma.contrast(color, 'white') > 2 ? 'white' : 'black') : data.color,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css())
            }
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css()
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white'
        }
    })
};

const animatedComponents = makeAnimated();

let getOptions = (data, color) => {
    let options = new Set(data);
    options = [...options].map((item) => {
        return { value: item, label: item, color };
    });
    return options;
};

let CustomSelect = (props) => {
    let theme = useTheme();
    let { label, field, data, color } = props;
    let { name } = field;

    let dispatch = useDispatch();
    let filterInfo = useSelector((state) => state.filter);

    let handleChange = (selectedOptions) => {
        let filter = selectedOptions.map((item) => item.value);
        let action = setFilter({ type: name, filter });
        dispatch(action);
    };

    return (
        <>
            <InputLabel focused sx={{ ...theme.typography.customInput }} htmlFor={name}>
                {label}
            </InputLabel>
            <Select
                {...props}
                id={name}
                isMulti
                styles={colourStyles}
                isSearchable
                options={getOptions(
                    data.map((item) => item[name]),
                    color
                )}
                defaultValue={getOptions(filterInfo[name], color)}
                components={animatedComponents}
                closeMenuOnSelect={false}
                placeholder={`--Filter by ${name}`}
                onChange={handleChange}
            />
        </>
    );
};

CustomSelect.propTypes = {
    label: PropTypes.string,
    field: PropTypes.object,
    data: PropTypes.arrayOf(PropTypes.object),
    color: PropTypes.string
};

export default CustomSelect;
