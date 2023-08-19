import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    token: null
};

export let authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            let accessToken = action.payload;
            state.token = accessToken;
            return state;
        },
        setLogout: (state) => {
            state.token = null;
            return state;
        }
    }
});

let { reducer, actions } = authSlice;
export let { setToken, setLogout } = actions;
export default reducer;
