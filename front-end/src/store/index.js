import customizationReducer from '../layout/MainLayout/customizeSlice';
import userReducer from '../views/pages/authentication/userSlice';

const { configureStore } = require('@reduxjs/toolkit');

export default configureStore({
    reducer: {
        customization: customizationReducer,
        user: userReducer
    }
});
