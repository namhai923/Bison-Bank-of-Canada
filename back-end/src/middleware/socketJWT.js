const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config/vars.config");

const socketJWT = (socket, next) => {
  let socketAuth = socket.handshake.auth.token;

  if (!socketAuth?.startsWith("Bearer ")) {
    console.log(socketAuth);
    return next(new Error("You are not authenticated."));
  } else {
    let accessToken = socketAuth.split(" ")[1];

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Token is not valid."));
      }
      socket.decoded = decoded;
      next();
    });
  }
};

module.exports = socketJWT;
