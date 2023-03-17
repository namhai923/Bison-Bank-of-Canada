import customizationReducer from '../layout/MainLayout/customizeSlice';
import userReducer from '../views/authentication/userSlice';
import filterReducer from '../views/banking/dashboard/filterSlice';

const { configureStore } = require('@reduxjs/toolkit');

export default configureStore({
    reducer: {
        customization: customizationReducer,
        user: userReducer,
        filter: filterReducer
    }
});
