import axiosClient from './axiosClient';

let bbcApi = {
    sendRecords: (params) => {
        let url = `/admin/sendRecords`;
        return axiosClient.post(url, { params });
    },
    createUser: (params) => {
        let url = `/user`;
        return axiosClient.post(url, { ...params });
    },
    getUser: (username) => {
        let url = `/user/${username}`;
        return axiosClient.get(url);
    }
};

export default bbcApi;
