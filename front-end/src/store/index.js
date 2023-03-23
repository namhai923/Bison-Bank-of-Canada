import customizationReducer from './customizeSlice';
import userReducer from './userSlice';
import filterReducer from '../ui-component/filter/filterSlice';

const { configureStore } = require('@reduxjs/toolkit');

export default configureStore({
    reducer: {
        customization: customizationReducer,
        user: userReducer,
        filter: filterReducer
    }
});
