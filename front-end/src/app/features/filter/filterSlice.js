import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    favorHistoryEmails: [],
    favorHistoryDateFrom: null,
    favorHistoryDateTo: null,
    favorHistoryAmountFrom: '',
    favorHistoryAmountTo: '',
    debtHistoryEmails: [],
    debtHistoryDateFrom: null,
    debtHistoryDateTo: null,
    debtHistoryAmountFrom: '',
    debtHistoryAmountTo: '',
    repayHistoryEmails: [],
    repayHistoryDateFrom: null,
    repayHistoryDateTo: null,
    repayHistoryAmountFrom: '',
    repayHistoryAmountTo: '',
    favorSummaryEmails: [],
    favorSummaryAmountFrom: '',
    favorSummaryAmountTo: '',
    debtSummaryEmails: [],
    debtSummaryAmountFrom: '',
    debtSummaryAmountTo: ''
};

export let valueSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state[action.payload.type] = action.payload.value;
            return state;
        }
    }
});

let { reducer, actions } = valueSlice;
export let { setFilter } = actions;
export default reducer;
