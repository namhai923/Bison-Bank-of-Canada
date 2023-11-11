import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import * as serviceWorker from 'serviceWorker';
import App from 'App';
import store from './app/store';

import 'assets/scss/style.scss';
import config from 'assets/data/config';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={config.basename}>
                <App />
                <ToastContainer position="top-center" autoClose={2000} />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
