const pokeApi = require("./api/pokeApi");
const { NO_IMAGE_NAME } = require("./pokeData");

const getPokemons = async (types) => {
  try {
    let pokemons = Promise.all(
      types.map(async (type) => {
        let data = await pokeApi.getType(type);
        let { pokemon: pokeList } = data;
        return pokeList
          .map((pokemon) => pokemon.pokemon.name)
          .filter((pokeName) => !NO_IMAGE_NAME.includes(pokeName));
      })
    );
    return pokemons;
  } catch (error) {
    throw error;
  }
};

const intersectPokes = (pokeArr) => {
  return pokeArr.reduce((previous, current) =>
    previous.filter((pokemon) => current.includes(pokemon))
  );
};

const randomPokemon = async (selectedTypes) => {
  try {
    let ftrPokes = await getPokemons(selectedTypes);
    if (selectedTypes.length === 2) {
      ftrPokes = intersectPokes(ftrPokes);
    } else {
      ftrPokes = ftrPokes[0];
    }
    if (ftrPokes.length === 0) {
      return null;
    }
    let myPokemon = ftrPokes[Math.trunc(Math.random() * ftrPokes.length)];
    return myPokemon;
  } catch (error) {
    throw error;
  }
};

const getPokeData = async (pokeName) => {
  try {
    let data = await pokeApi.getPokemon(pokeName);
    let image = data["sprites"]["other"]["official-artwork"]["front_default"];
    let types = data["types"].map((typeData) => typeData.type.name);
    let speciesData = await pokeApi.getPokeSpecies(data["species"]["name"]);
    let description = "Not available";
    let flavorText = speciesData["flavor_text_entries"].find(
      (line) => line["language"]["name"] === "en"
    );
    if (flavorText) {
      description = flavorText["flavor_text"];
    }
    return { image, types, description };
  } catch (error) {
    throw error;
  }
};

module.exports = { randomPokemon, getPokeData };
