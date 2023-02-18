import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    userName: '',
    firstName: '',
    lastName: '',
    accountBalance: 0,
    expenseHistory: [],
    transferHistory: []
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

export let userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state = action.payload.user;
            return state;
        }
    }
});

let { reducer, actions } = userSlice;
export let { setUser } = actions;
export default reducer;
