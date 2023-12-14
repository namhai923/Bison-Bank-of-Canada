import { createSlice } from '@reduxjs/toolkit';

import config from 'assets/data/config';

let initialState = {
    isOpen: [], // for active default menu
    defaultId: 'overview',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    chatOpened: true,
    costOpened: true
};

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
        },
        setChat: (state, action) => {
            return { ...state, chatOpened: action.payload };
        },
        setCost: (state, action) => {
            return { ...state, costOpened: action.payload };
        }
    }
});

let { reducer, actions } = customizationSlice;
export let { openMenu, setMenu, setChat, setCost } = actions;
export default reducer;
