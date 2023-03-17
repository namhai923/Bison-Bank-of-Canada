import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    location: [],
    category: [],
    sender: [],
    receiver: []
};

export let filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state[action.payload.type] = action.payload.filter;
            return state;
        }
    }
});

let { reducer, actions } = filterSlice;
export let { setFilter } = actions;
export default reducer;
