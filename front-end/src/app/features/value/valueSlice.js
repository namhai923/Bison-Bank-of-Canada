import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    favorHistoryUserName: [],
    favorHistoryDateFrom: null,
    favorHistoryDateTo: null,
    favorHistoryAmountFrom: '',
    favorHistoryAmountTo: '',
    debtHistoryUserName: [],
    debtHistoryDateFrom: null,
    debtHistoryDateTo: null,
    debtHistoryAmountFrom: '',
    debtHistoryAmountTo: '',
    repayHistoryUserName: [],
    repayHistoryDateFrom: null,
    repayHistoryDateTo: null,
    repayHistoryAmountFrom: '',
    repayHistoryAmountTo: '',
    favorSummaryUserName: [],
    favorSummaryAmountFrom: '',
    favorSummaryAmountTo: '',
    debtSummaryUserName: [],
    debtSummaryAmountFrom: '',
    debtSummaryAmountTo: '',
    dob: null,
    emails: [],
    currentConversation: null,
    notification: 'all'
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
