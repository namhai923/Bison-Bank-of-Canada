const { FRONTEND_URL } = require("./config/vars.config");
const socketJWT = require("./middleware/socketJWT");
const messageService = require("./services/message.service");
const { connectedUsers } = require("./utilities");

const socket = (app) => {
  const io = require("socket.io")(app, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.use(socketJWT);

  const onConnection = (socket) => {
    let userName = socket.decoded.userName;
    connectedUsers.set(userName, socket.id);

    messageService(io, socket);

    socket.on("disconnect", () => {
      connectedUsers.delete(userName);
    });
  };

  io.on("connection", onConnection);
};

module.exports = { connectedUsers, socket };
