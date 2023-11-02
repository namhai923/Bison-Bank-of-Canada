const User = require("./models/user.model");
const { cache, setCacheExpire } = require("./cache");
const { CACHE_EXPIRED_IN_SECONDS } = require("./config/vars.config");

const connectedUsers = new Map();

const getUser = async (userName) => {
  let userInfo;
  if (cache.has(userName)) {
    userInfo = cache.get(userName);
  } else {
    // If not found in cache then go to database to search
    userInfo = await User.findOne({ userName });

    // Set cache and set it to expired in 300 seconds
    cache.set(userName, userInfo);
    setCacheExpire(userName, CACHE_EXPIRED_IN_SECONDS);
  }
  return userInfo;
};

const decimalAdd = (a, b) => {
  return Math.round(parseFloat(a * 100) + parseFloat(b * 100)) / 100;
};

module.exports = { connectedUsers, getUser, decimalAdd };
