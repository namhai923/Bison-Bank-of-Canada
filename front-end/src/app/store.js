import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from 'app/api/apiSlice';
import customizationReducer from './features/customize/customizeSlice';
import valueReducer from './features/value/valueSlice';
import filterReducer from './features/filter/filterSlice';
import requestReducer from './features/request/requestSlice';
import authReducer from './features/auth/authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        customization: customizationReducer,
        value: valueReducer,
        filter: filterReducer,
        request: requestReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
    devTools: true
});

setupListeners(store.dispatch);

export default store;
