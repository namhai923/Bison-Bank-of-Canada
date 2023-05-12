import axiosClient from './axiosClient';

let bbcApi = {
    registerUser: (params) => {
        let url = `/user/register`;
        return axiosClient.post(url, { ...params });
    },
    getUser: (params) => {
        let url = `/user/getInfo`;
        return axiosClient.post(url, { ...params });
    },
    updateUser: (params) => {
        let url = `/user/updateInfo`;
        return axiosClient.post(url, { ...params });
    },
    transfer: (params) => {
        let url = `/user/transfer`;
        return axiosClient.post(url, { ...params });
    },
    expense: (params) => {
        let url = `/user/expense`;
        return axiosClient.post(url, { ...params });
    }
};

export default bbcApi;
