// const socket = require("socket.io");

const mongoose = require("mongoose");

const { PORT } = require("./src/config/vars.config");
const app = require("./src/app");
const { logEvent } = require("./src/middleware/logger");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT || 3000, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Server is running, listening to port %d", PORT);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvent(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

// const io = socket(server, {
//   cors: {
//     origin: FRONTEND_URL,
//   },
// });

// let users = new Map();

// const addUser = (userId, socketId) => {
//   !users.has(userId) && users.set(userId, socketId);
// };

// const removeUser = (userId) => {
//   users.has(userId) && users.delete(userId);
// };

// const getUser = (userId) => {
//   return users.get(userId);
// };

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   addUser(userId, socket.id);

//   socket.on("sendTransfer", ({ senderId, receiverId, transfer }) => {
//     console.log("a user try to send a transfer");
//     const user = getUser(receiverId);
//     // console.log(users);
//     if (user) {
//       io.to(user.socketId).emit("getTransfer", {
//         senderId: senderId,
//         transfer,
//       });
//     }
//   });

//   socket.on("disconnect", (userId) => {
//     console.log("a user disconnected");
//     removeUser(userId);
//   });
// });
