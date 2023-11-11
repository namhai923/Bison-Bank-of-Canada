import PropTypes from 'prop-types';

import chroma from 'chroma-js';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        if (data.__isNew__) {
            data.color = '#2196f3';
        }
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
        if (data.__isNew__) {
            data.color = '#2196f3';
        }
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
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
};

const animatedComponents = makeAnimated();

let CustomSelect = (props) => {
    let { field, options, form, defaultSelected, handleSelectChange, placeholder, creatable, selectRef } = props;
    let { name } = field;

    let handleChange = (selectedOptions) => {
        let selected = selectedOptions.map((item) => item.value);
        handleSelectChange && handleSelectChange(selected);
        form.setFieldValue(name, selected);
    };

    return (
        <>
            {creatable ? (
                <>
                    <CreatableSelect
                        {...props}
                        id={name}
                        isMulti
                        styles={colourStyles}
                        isSearchable
                        options={options}
                        ref={selectRef}
                        defaultValue={defaultSelected}
                        components={animatedComponents}
                        closeMenuOnSelect={false}
                        placeholder={placeholder}
                        onChange={handleChange}
                        menuPortalTarget={document.body}
                    />
                </>
            ) : (
                <>
                    <Select
                        {...props}
                        id={name}
                        isMulti
                        styles={colourStyles}
                        isSearchable
                        options={options}
                        ref={selectRef}
                        defaultValue={defaultSelected}
                        components={animatedComponents}
                        closeMenuOnSelect={false}
                        placeholder={placeholder}
                        onChange={handleChange}
                        menuPortalTarget={document.body}
                    />
                </>
            )}
        </>
    );
};

CustomSelect.propTypes = {
    field: PropTypes.object,
    options: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object,
    defaultSelected: PropTypes.arrayOf(PropTypes.object),
    handleSelectChange: PropTypes.func,
    placeholder: PropTypes.string,
    creatable: PropTypes.bool,
    selectRef: PropTypes.object
};

export default CustomSelect;
