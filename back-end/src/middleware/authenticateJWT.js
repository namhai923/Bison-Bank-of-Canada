const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config/vars.config");

const authenticateJWT = (req, res, next) => {
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "You are not authenticated." });
  } else {
    let accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid." });
      }
      req.user = user;
      next();
    });
  }
};

module.exports = authenticateJWT;
