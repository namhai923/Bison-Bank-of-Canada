import { axiosClient, axiosJWTClient } from './axiosClient';

let bbcApi = {
    registerUser: (params) => {
        let url = `/auth/register`;
        return axiosClient.post(url, { ...params });
    },
    loginUser: (params) => {
        let url = `/auth/login`;
        return axiosClient.post(url, { ...params });
    },
    refreshToken: () => {
        let url = `/auth/refresh`;
        return axiosJWTClient.get(url);
    },
    logoutUser: () => {
        let url = `/auth/logout`;
        return axiosJWTClient.get(url);
    },
    getUser: (params) => {
        let url = `/user/getInfo`;
        return axiosJWTClient.post(url, { ...params });
    },
    updateUser: (params) => {
        let url = `/user/updateInfo`;
        return axiosJWTClient.post(url, { ...params });
    },
    transfer: (params) => {
        let url = `/user/transfer`;
        return axiosJWTClient.post(url, { ...params });
    },
    expense: (params) => {
        let url = `/user/expense`;
        return axiosJWTClient.post(url, { ...params });
    }
};

export default bbcApi;
