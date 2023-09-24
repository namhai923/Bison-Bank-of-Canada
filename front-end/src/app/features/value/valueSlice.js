import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    location: [],
    category: [],
    sender: [],
    receiver: [],
    emails: [],
    currentConversation: null
};

export let valueSlice = createSlice({
    name: 'value',
    initialState,
    reducers: {
        setValue: (state, action) => {
            state[action.payload.type] = action.payload.value;
            return state;
        }
    }
});

let { reducer, actions } = valueSlice;
export let { setValue } = actions;
export default reducer;
