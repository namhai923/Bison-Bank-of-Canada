import { createSlice } from '@reduxjs/toolkit';
import blankState from 'assets/data/blankState';

const userInfo = localStorage.getItem('userInfo') !== null ? JSON.parse(localStorage.getItem('userInfo')) : blankState;

let initialState = {
    userName: userInfo.userName,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    dob: userInfo.dob,
    phoneNumber: userInfo.phoneNumber,
    accountBalance: userInfo.accountBalance,
    expenseHistory: userInfo.expenseHistory,
    transferHistory: userInfo.transferHistory
};

export let userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(state));
            return state;
        },
        addTransfer: (state, action) => {
            state.transferHistory.push(action.payload);
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.transferHistory.push(action.payload);
            return state;
        },
        addExpense: (state, action) => {
            state.expenseHistory.push(action.payload);
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.expenseHistory.push(action.payload);
            return state;
        }
    }
});

let { reducer, actions } = userSlice;
export let { setUser, addTransfer, addExpense } = actions;
export default reducer;
