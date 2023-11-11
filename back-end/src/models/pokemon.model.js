const mongoose = require("mongoose");

let pokemonSchema = new mongoose.Schema(
  {
    types: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { collection: "Pokemons" }
);

module.exports = mongoose.model("Pokemon", pokemonSchema);
