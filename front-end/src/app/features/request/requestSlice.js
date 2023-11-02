import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    favorRequestEmails: [],
    favorRequestAmount: '',
    favorRequestDescription: '',
    repayRequestEmails: [],
    repayRequestAmount: '',
    repayRequestDescription: ''
};

export let requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        addEmails: (state, action) => {
            action.payload.value.forEach((email) => {
                if (!state[action.payload.type].includes(email)) {
                    state[action.payload.type].push(email);
                }
            });
            return state;
        },
        setRequestValue: (state, action) => {
            state[action.payload.type] = action.payload.value;
            return state;
        }
    }
});

let { reducer, actions } = requestSlice;
export let { addEmails, setRequestValue } = actions;
export default reducer;
