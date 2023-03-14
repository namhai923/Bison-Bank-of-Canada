import axiosClient from './axiosClient';

let bbcApi = {
    transfer: (params) => {
        let url = `/${params.userName}/transfer`;
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
