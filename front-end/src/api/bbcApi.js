import axiosClient from './axiosClient';

let bbcApi = {
    createUser: (params) => {
        let url = `/user`;
        return axiosClient.post(url, { ...params });
    },
    getUser: (username) => {
        let url = `/user/${username}`;
        return axiosClient.get(url);
    },
    updateUser: (params) => {
        let url = `/user/${params.userName}`;
        return axiosClient.post(url, { ...params });
    },
    transfer: (params) => {
        let url = `/user/${params.userName}/transfer`;
        let receiverName = params.receiverName;
        let amount = params.amount;
        return axiosClient.post(url, { receiverName, amount });
    },
    expense: (params) => {
        let url = `/user/${params.userName}/expense`;
        let location = params.location;
        let category = params.category;
        let amount = params.amount;
        return axiosClient.post(url, { location, category, amount });
    }
};

export default bbcApi;
