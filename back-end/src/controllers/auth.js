const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CACHE_EXPIRED_IN_SECONDS,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_EXPIRED,
} = require("../config/vars.config");
const User = require("../models/user.model");
const Credential = require("../models/credential.model");
const { cache, setCacheExpire } = require("../cache");

const checkParams = (obj, params) => {
  return params.every((param) => Object.keys(obj).includes(param));
};

const generateAccessToken = (userName) => {
  let accessToken = jwt.sign({ userName }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRED,
  });
  return accessToken;
};

const generateRefreshToken = (userName) => {
  let refreshToken = jwt.sign({ userName }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRED,
  });
  return refreshToken;
};

const refresh = (req, res) => {
  let cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "You are not authenticated." });
  }

  let refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "You are not authenticated." });
      }
      let userInfo = await User.findOne({ userName: user.userName });
      if (!userInfo) {
        return res.status(401).json({ message: "You are not authenticated." });
      }
      const newAccessToken = generateAccessToken(user);

      return res.status(200).json({ accessToken: newAccessToken });
    })
  );
};

const register = asyncHandler(async (req, res) => {
  if (
    !checkParams(req.body, [
      "userName",
      "password",
      "firstName",
      "lastName",
      "accountBalance",
    ])
  ) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  let { userName, password, firstName, lastName, accountBalance } = req.body;
  let userInfo = await Credential.findOne({ userName }).lean().exec();

  // check if the username exist, if not then add user
  if (userInfo !== null) {
    return res.status(401).json({ message: "Username Already Exists." });
  } else {
    let newUser = new User({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      accountBalance: accountBalance ?? 0,
    });

    let hashedPassword = await bcrypt.hash(password, 13);
    let userCred = new Credential({
      userName: userName,
      password: hashedPassword,
    });
    userInfo = await newUser.save();
    await userCred.save();

    return res.status(200).json({ message: "Account created successfully." });
  }
});

const login = asyncHandler(async (req, res) => {
  if (!checkParams(req.body, ["userName", "password"])) {
    return res
      .status(400)
      .json({ message: "Missing require parameter in request body." });
  }

  let { userName, password } = req.body;
  let userCred = await Credential.findOne({ userName }).lean().exec();

  if (userCred === null) {
    return res.status(401).json({ message: "Username not existed" });
  }
  let match = await bcrypt.compare(password, userCred.password);
  if (!match) {
    return res.status(401).json({ message: "Wrong Password" });
  }

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

  let accessToken = generateAccessToken(userName);
  let refreshToken = generateRefreshToken(userName);

  return res
    .status(200)
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ userInfo, accessToken });
});

const logout = (req, res) => {
  let cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  return res
    .status(200)
    .clearCookie("jwt", { hhtpOnly: true, sameSite: "None", secure: true })
    .json("Logged out successfully");
};

module.exports = { refresh, register, login, logout };
