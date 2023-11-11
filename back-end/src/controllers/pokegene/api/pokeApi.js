const axiosClient = require("./axiosClient");

let pokeApi = {
  getType: (type) => {
    let url = `/type/${type}`;
    return axiosClient.get(url);
  },
  getPokemon: (name) => {
    let url = `/pokemon/${name}`;
    return axiosClient.get(url);
  },
  getPokeSpecies: (species) => {
    let url = `/pokemon-species/${species}`;
    return axiosClient.get(url);
  },
};

module.exports = pokeApi;
