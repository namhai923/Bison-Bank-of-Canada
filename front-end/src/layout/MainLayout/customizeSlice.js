import { createSlice } from '@reduxjs/toolkit';

// project imports
import config from '../../config';

let initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

export let customizationSlice = createSlice({
    name: 'customization',
    initialState,
    reducers: {
        openMenu: (state, action) => {
            id = action.payload.id;
            return { ...state, isOpen: [id] };
        },
        setMenu: (state, action) => {
            return { ...state, opened: action.payload.opened };
        }
    }
});

let { reducer, actions } = customizationSlice;
export let { openMenu, setMenu } = actions;
export default reducer;
