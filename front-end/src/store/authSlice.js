import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    token: null
};

export let authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            let accessToken = action.payload;
            state.token = accessToken;
            return state;
        },
        logout: (state) => {
            state.token = null;
            return state;
        }
    }
});

let { reducer, actions } = authSlice;
export let { setCredentials, logout } = actions;
export default reducer;
