import axios from 'axios';
import queryString from 'query-string';
import jwt_decode from 'jwt-decode';

import { useSelector } from 'react-redux';
import bbcApi from './bbcApi';

let axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'content-type': 'application/json'
    },
    withCredentials: true,
    paramSerializer: (params) => queryString.stringify(params)
});

let axiosJWTClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'content-type': 'application/json'
    },
    withCredentials: true,
    paramSerializer: (params) => queryString.stringify(params)
});

// let refreshToken = async () => {
//     try {
//         await bbcApi.refreshToken({ token: localStorage.getItem('refreshToken') });
//     } catch (err) {
//         console.log(err);
//     }
// };

axiosJWTClient.interceptors.request.use(
    async (config) => {
        let current = new Date();
        let accessToken = useSelector((state) => state.auth.token);
        if (accessToken) {
            let decodedToken = jwt_decode(accessToken);
            if (decodedToken.exp * 1000 < current.getTime()) {
                await bbcApi.refreshToken();
            }
            return config;
        } else {
            throw new axios.Cancel('Token missing.');
        }
    },
    (error) => {
        throw error;
    }
);

axiosJWTClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    }
);

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        throw error;
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    }
);

export { axiosClient, axiosJWTClient };
