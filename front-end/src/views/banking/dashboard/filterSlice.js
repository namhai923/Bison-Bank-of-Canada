import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    location: null,
    category: null
};

const locationInfo = localStorage.getItem('locationInfo') !== null ? JSON.parse(localStorage.getItem('locationInfo')) : initialState;

export let filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        editLocation: (state, action) => {
            state = action.payload.locationInfo;
            return state;
        }
    }
});

let { reducer, actions } = filterSlice;
export let { editLocation, editCategory } = actions;
export default reducer;
