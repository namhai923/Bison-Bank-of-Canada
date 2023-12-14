const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { validateUserName, validateSendMessage } = require("../validators");
const { getUser } = require("../utilities");

const getConversationsInfo = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { conversationHistory } = userInfo.toJSON();
  let conversationsInfo = conversationHistory.map((conversation) => {
    let { userName, latestMessage, unRead } = conversation;
    return { userName, latestMessage, unRead };
  });

  return res.status(200).json(conversationsInfo);
});

const getConversation = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: conversationUserName } = value;
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });

  let { conversationHistory } = userInfo;
  let messages = [];
  let conversation = conversationHistory.find(
    (conversation) => conversation.userName === conversationUserName
  );

  if (conversation) {
    messages = conversation.messages;

    conversation.unRead = 0;
    await userInfo.save();
    if (cache.has(userName)) {
      cache.set(userName, userInfo);
    }
  }

  return res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { error, value } = validateSendMessage(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: receiverName, message } = value;
  let senderName = req.user.userName;
  let errorMessage = "";

  let receiver = await User.findOne({ userName: receiverName });
  let messageInfo;
  if (receiver === null) {
    errorMessage = `${receiverName} does not exist!`;
  } else {
    let sender = await User.findOne({ userName: senderName });
    let { conversationHistory: senderHistory } = sender;

    let existedConversation = false;
    for (let i = 0; i < senderHistory.length; i++) {
      if (senderHistory[i].userName === receiver.userName) {
        let length = senderHistory[i].messages.push({ message, sending: true });
        senderHistory[i].latestMessage.set(
          senderHistory[i].messages[length - 1]
        );

        existedConversation = true;
        break;
      }
    }

    if (!existedConversation) {
      senderHistory.push({
        userName: receiver.userName,
        latestMessage: { message, sending: true },
        unRead: 0,
        messages: [{ message, sending: true }],
      });
    }

    let { conversationHistory: receiverHistory } = receiver;
    existedConversation = false;
    for (let i = 0; i < receiverHistory.length; i++) {
      if (receiverHistory[i].userName === sender.userName) {
        let length = receiverHistory[i].messages.push({
          message,
          sending: false,
        });
        receiverHistory[i].unRead += 1;

        messageInfo = {
          latestMessage: receiverHistory[i].messages[length - 1],
          sender: sender.userName,
        };
        receiverHistory[i].latestMessage.set(messageInfo.latestMessage);

        existedConversation = true;
        break;
      }
    }

    if (!existedConversation) {
      let length = receiverHistory.push({
        userName: sender.userName,
        latestMessage: { message, sending: false },
        unRead: 1,
        messages: [{ message, sending: false }],
      });
      messageInfo = {
        latestMessage: receiverHistory[length - 1].latestMessage,
        sender: sender.userName,
      };
    }

    await Promise.all([sender.save(), receiver.save()]);
    if (cache.has(senderName)) {
      cache.set(senderName, sender);
    }
    if (cache.has(receiverName)) {
      cache.set(receiverName, receiver);
    }
  }

  if (errorMessage === "") {
    return res.status(200).json(messageInfo);
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: removeConversation } = value;

  let userName = req.user.userName;
  let user = await User.findOne({ userName });
  user.conversationHistory = user.conversationHistory.filter(
    (conversation) => conversation.userName !== removeConversation
  );

  await user.save();

  if (cache.has(userName)) {
    cache.set(userName, user);
  }
  return res.status(200).json("Conversation deleted!");
});

module.exports = {
  getConversationsInfo,
  getConversation,
  sendMessage,
  deleteConversation,
};
