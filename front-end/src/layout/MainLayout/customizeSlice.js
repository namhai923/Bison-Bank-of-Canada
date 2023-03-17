import { createSlice } from '@reduxjs/toolkit';

// project imports
import config from '../../config';

let initialState = {
    isOpen: [], // for active default menu
    defaultId: 'dashboard',
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
            state.isOpen = [action.payload];
            return state;
        },
        setMenu: (state, action) => {
            return { ...state, opened: action.payload };
        }
    }
});

let { reducer, actions } = customizationSlice;
export let { openMenu, setMenu } = actions;
export default reducer;
