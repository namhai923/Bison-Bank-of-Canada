const { connectedUsers } = require("../utilities");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { cache } = require("../cache");

module.exports = (io, socket) => {
  const sendMessage = (userName, messageInfo) => {
    if (connectedUsers.has(userName)) {
      io.to(connectedUsers.get(userName)).emit("message:receive", messageInfo);
    }
  };

  const readMessage = asyncHandler(async (senderName) => {
    let userName = socket.decoded.userName;
    let userInfo = await User.findOne({ userName });
    let { conversationHistory } = userInfo;
    let conversation = conversationHistory.find(
      (conversation) => conversation.userName === senderName
    );

    if (conversation) {
      conversation.unRead = 0;
      await userInfo.save();
      if (cache.has(userName)) {
        cache.set(userName, userInfo);
      }
    }
  });

  socket.on("message:send", sendMessage);
  socket.on("message:read", readMessage);
};
