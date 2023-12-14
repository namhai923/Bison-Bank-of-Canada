const asyncHandler = require("express-async-handler");

const User = require("../../models/user.model");
const Pokemon = require("../../models/pokemon.model");
const { cache } = require("../../cache");
const {
  validateGeneratePokemon,
  validateRemovePokemon,
  validateSendPokemon,
} = require("../../validators");
const { getUser } = require("../../utilities");
const { randomPokemon, getPokeData } = require("./pokemonUtils");
const { POKEGENE_COST } = require("./pokeData");

const getCollection = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { pokeCollection } = userInfo;
  await userInfo.populate("pokeCollection.pokemon");
  return res.status(200).json(pokeCollection);
});

const generatePokemon = asyncHandler(async (req, res) => {
  const { error, value } = validateGeneratePokemon(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { types } = value;
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });

  let totalCost = types.reduce(
    (totalCost, currentType) =>
      totalCost + POKEGENE_COST.find((type) => type.value === currentType).cost,
    0
  );
  if (userInfo.creditPoints < totalCost) {
    return res.status(400).json("Not enough credit points!");
  }

  let myPokemon = await randomPokemon(types);
  if (myPokemon) {
    let savedPokemon = await Pokemon.findOne({ name: myPokemon });
    if (!savedPokemon) {
      let pokeData = await getPokeData(myPokemon);

      let newPokemon = new Pokemon({
        types: pokeData.types,
        name: myPokemon,
        image: pokeData.image,
        description: pokeData.description,
      });
      savedPokemon = await newPokemon.save();
    }

    let { pokeCollection } = userInfo;
    pokeCollection.push({ pokemon: savedPokemon._id });

    userInfo.creditPoints = userInfo.creditPoints - totalCost;

    await userInfo.save();
    if (cache.has(userName)) {
      cache.set(userName, userInfo);
    }
    return res.status(200).json(savedPokemon);
  } else {
    return res.status(200).json("There is no pokemon available!");
  }
});

const removePokemon = asyncHandler(async (req, res) => {
  const { error, value } = validateRemovePokemon(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { removeId } = value;
  let userName = req.user.userName;

  let user = await User.findOne({ userName });
  user.pokeCollection = user.pokeCollection.filter(
    (collectionItem) => !collectionItem._id.equals(removeId)
  );

  await user.save();

  if (cache.has(userName)) {
    cache.set(userName, user);
  }

  return res.status(200).json("Pokemon removed!");
});

const sendPokemon = asyncHandler(async (req, res) => {
  const { error, value } = validateSendPokemon(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: receiverName, sendId } = value;
  let userName = req.user.userName;
  let errorMessage = "";

  if (userName === receiverName) {
    errorMessage = "Cannot send pokemon to yourself!";
  } else {
    let receiver = await User.findOne({ userName: receiverName });
    if (receiver === null) {
      errorMessage = `${receiverName} does not exist!`;
    } else {
      let user = await User.findOne({ userName });
      let { pokemon } = user.pokeCollection.find((item) =>
        item._id.equals(sendId)
      );
      if (!pokemon) {
        errorMessage = "Pokemon does not exist!";
      } else {
        user.pokeCollection = user.pokeCollection.filter(
          (collectionItem) => !collectionItem._id.equals(sendId)
        );
        receiver.pokeCollection.push({ pokemon });

        receiver.notificationList.push({
          userName,
          type: "pokemon:send",
        });

        await Promise.all([user.save(), receiver.save()]);
        if (cache.has(userName)) {
          cache.set(userName, user);
        }
        if (cache.has(receiverName)) {
          cache.set(receiverName, receiver);
        }
      }
    }
  }

  if (errorMessage === "") {
    return res.status(200).json("Pokemon sent!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

module.exports = {
  getCollection,
  generatePokemon,
  removePokemon,
  sendPokemon,
};
