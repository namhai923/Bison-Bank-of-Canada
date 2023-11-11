const axios = require("axios");
const dotenv = require("dotenv");

const { POKEAPI_URL } = require("../../../config/vars.config");

dotenv.config();

let axiosClient = axios.create({
  baseURL: POKEAPI_URL,
  header: { "content-type": "application/json" },
});

axiosClient.interceptors.response.use(
  (res) => {
    if (res && res.data) {
      return res.data;
    }
    return res;
  },
  (error) => {
    throw error;
  }
);

module.exports = axiosClient;
