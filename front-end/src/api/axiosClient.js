import axios from 'axios';
import queryString from 'query-string';

let axiosClient = axios.create({
    baseURL: 'http://localhost:5000',
    // baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'content-type': 'application/json'
    },
    paramSerializer: (params) => queryString.stringify(params)
});

axiosClient.interceptors.request.use((config) => {
    return config;
}),
    (error) => {
        throw error;
    };

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
export default axiosClient;
