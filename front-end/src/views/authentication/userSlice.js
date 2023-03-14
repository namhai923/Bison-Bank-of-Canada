import { createSlice } from '@reduxjs/toolkit';
import blankState from 'assets/data/blankState';

const userInfo = localStorage.getItem('userInfo') !== null ? JSON.parse(localStorage.getItem('userInfo')) : blankState;

let initialState = {
    userName: userInfo.userName,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
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
        }
    }
});

let { reducer, actions } = userSlice;
export let { setUser } = actions;
export default reducer;
