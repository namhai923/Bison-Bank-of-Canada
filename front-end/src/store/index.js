import { configureStore } from '@reduxjs/toolkit';

import customizationReducer from './customizeSlice';
import userReducer from './userSlice';
import filterReducer from './filterSlice';
import authReducer from './authSlice';

export default configureStore({
    reducer: {
        customization: customizationReducer,
        user: userReducer,
        filter: filterReducer,
        auth: authReducer
    }
});
