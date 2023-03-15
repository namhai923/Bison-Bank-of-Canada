import axiosClient from './axiosClient';

let bbcApi = {
    transfer: (params) => {
        let url = `/user/${params.userName}/transfer`;
        let receiverName = params.receiverName;
        let amount = params.amount;
        return axiosClient.post(url, { receiverName, amount });
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
