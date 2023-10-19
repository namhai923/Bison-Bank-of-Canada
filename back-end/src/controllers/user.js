const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

const User = require("../models/user.model");
const { cache, setCacheExpire } = require("../cache");
const connectedUsers = require("../connectedUsers");
const { CACHE_EXPIRED_IN_SECONDS } = require("../config/vars.config");
const {
  validateUserName,
  validateUUID,
  validateResponse,
  validateMakeRequest,
  validateUpdateInfo,
  validateRemoveContacts,
  validateSendMessage,
  validateSearchUser,
} = require("../validators");

const decimalAdd = (a, b) => {
  return Math.round(parseFloat(a * 100) + parseFloat(b * 100)) / 100;
};

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

const getInfo = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { firstName, lastName, dob, phoneNumber } = userInfo.toJSON();
  return res.status(200).json({ firstName, lastName, dob, phoneNumber });
});

const getFavorSummary = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { favorSummary } = userInfo.toJSON();
  return res.status(200).json(favorSummary);
});

const getDebtSummary = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { debtSummary } = userInfo.toJSON();
  return res.status(200).json(debtSummary);
});

const getPendingFavor = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { pendingFavor } = userInfo.toJSON();
  return res.status(200).json(pendingFavor);
});

const getPendingRepay = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { pendingRepay } = userInfo.toJSON();
  return res.status(200).json(pendingRepay);
});

const getFavorHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { favorHistory } = userInfo.toJSON();
  return res.status(200).json(favorHistory);
});

const getDebtHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { debtHistory } = userInfo.toJSON();
  return res.status(200).json(debtHistory);
});

const getRepayHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { repayHistory } = userInfo.toJSON();
  return res.status(200).json(repayHistory);
});

const getContacts = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { contacts } = userInfo.toJSON();
  let contactsInfo = await Promise.all(
    contacts.map(async (contact) => {
      let contactInfo = await getUser(contact.userName);
      let active = connectedUsers.has(contact.userName);
      let { userName, firstName, lastName } = contactInfo.toJSON();
      return { userName, firstName, lastName, active };
    })
  );
  return res.status(200).json(contactsInfo);
});

const getNotificationList = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });

  let { notificationList } = userInfo;
  await userInfo.save();
  if (cache.has(userName)) {
    cache.set(userName, userInfo);
  }
  return res.status(200).json(notificationList);
});

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

const searchUser = asyncHandler(async (req, res) => {
  const { error, value } = validateSearchUser(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { searchQuery } = value;

  const findUsers = await User.find({
    userName: { $regex: searchQuery },
  }).select("userName");
  return res.status(200).json(findUsers);
});

const updateInfo = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateInfo(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { firstName, lastName, dob, phoneNumber } = value;
  let userName = req.user.userName;
  let user = await User.findOne({ userName });

  user.firstName = firstName;
  user.lastName = lastName;
  user.dob = dob;
  user.phoneNumber = phoneNumber;

  await user.save();

  if (cache.has(userName)) {
    cache.set(userName, user);
  }

  return res.status(200).json("Information updated!");
});

const makeFavorRequest = asyncHandler(async (req, res) => {
  const { error, value } = validateMakeRequest(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { accounts, amount, description } = value;
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });
  let errorMessage = "";
  let receivers = [];

  for (let account of accounts) {
    if (account === userName) {
      errorMessage = "Cannot make a favor to yourself!";
      break;
    } else {
      let receiver = await User.findOne({ userName: account });
      if (receiver === null) {
        errorMessage = `${receiver} does not exist!`;
        break;
      } else {
        let favorId = uuid.v4();
        let favorInfo = {
          favorId,
          userName: account,
          amount,
          description,
        };
        userInfo.favorHistory.push(favorInfo);

        favorInfo.userName = userName;

        receiver.pendingFavor.push(favorInfo);
        receiver.notificationList.push({
          userName,
          type: "favor:request",
        });
        receivers.push(receiver);
      }
    }
  }

  if (errorMessage === "") {
    await Promise.all([
      ...receivers.map(async (receiver) => await receiver.save()),
      await userInfo.save(),
    ]);
    for (let receiver of receivers) {
      if (cache.has(receiver.userName)) {
        cache.set(receiver.userName, receiver);
      }
    }

    if (cache.has(userName)) {
      cache.set(userName, userInfo);
    }

    return res.status(200).json("Make favor successfully!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const responseFavor = asyncHandler(async (req, res) => {
  const { error, value } = validateResponse(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { accepted, id: favorId } = value;
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });
  let errorMessage = "";

  let favor = userInfo.pendingFavor.find((favor) => favor.favorId === favorId);
  if (favor) {
    let sender = await User.findOne({ userName: favor.userName });
    if (sender) {
      let senderProcessingFavor = sender.favorHistory.find(
        (processingFavor) => processingFavor.favorId === favorId
      );
      senderProcessingFavor.accepted = accepted;

      let notificationType;
      if (accepted) {
        userInfo.debtHistory.push(favor);

        userInfo.debtSummary.total = decimalAdd(
          userInfo.debtSummary.total,
          favor.amount
        );

        let debtAccountSummary = userInfo.debtSummary.summary.find(
          (debtAccount) => debtAccount.userName === favor.userName
        );
        if (debtAccountSummary) {
          debtAccountSummary.amount = decimalAdd(
            debtAccountSummary.amount,
            favor.amount
          );
        } else {
          userInfo.debtSummary.summary.push({
            userName: favor.userName,
            amount: favor.amount,
          });
        }

        sender.favorSummary.total = decimalAdd(
          sender.favorSummary.total,
          favor.amount
        );
        let favorAccountSummary = sender.favorSummary.summary.find(
          (favorAccount) => favorAccount.userName === userName
        );
        if (favorAccountSummary) {
          favorAccountSummary.amount = decimalAdd(
            favorAccountSummary.amount,
            favor.amount
          );
        } else {
          sender.favorSummary.summary.push({
            userName,
            amount: favor.amount,
          });
        }
        notificationType = "favor:accept";
      } else {
        notificationType = "favor:decline";
      }
      sender.notificationList.push({
        userName,
        type: notificationType,
      });

      userInfo.pendingFavor = userInfo.pendingFavor.filter(
        (favor) => favor.favorId !== favorId
      );

      await Promise.all([userInfo.save(), sender.save()]);

      if (cache.has(userName)) {
        cache.set(userName, userInfo);
      }
      if (cache.has(sender.userName)) {
        cache.set(sender.userName, sender);
      }
    } else {
      errorMessage = `${favor.userName} does not exist!`;
    }
  } else {
    errorMessage = "Favor does not exist!";
  }

  if (errorMessage === "") {
    return res.status(200).json("Response favor successfully!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const makeRepayRequest = asyncHandler(async (req, res) => {
  const { error, value } = validateMakeRequest(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { accounts, amount, description } = value;
  let userName = req.user.userName;
  let errorMessage = "";
  let receivers = [];

  let userInfo = await User.findOne({ userName });

  for (let account of accounts) {
    if (account === userName) {
      errorMessage = "Cannot make a repay to yourself!";
      break;
    } else {
      let debtAccountSummary = userInfo.debtSummary.summary.find(
        (summary) => summary.userName === account
      );
      if (debtAccountSummary) {
        let processingRepays = userInfo.repayHistory.filter((repay) => {
          return (
            repay.userName === account &&
            repay.send &&
            repay.accepted === undefined
          );
        });

        let totalProcessingRepay = processingRepays.reduce(
          (total, processingRepay) => decimalAdd(total, processingRepay.amount),
          0
        );

        if (
          decimalAdd(debtAccountSummary.amount, -totalProcessingRepay) < amount
        ) {
          errorMessage = "Cannot make a repay more than what you owe!";
          break;
        }
      } else {
        errorMessage = `You do not owe ${account}!`;
        break;
      }

      let receiver = await User.findOne({ userName: account });
      if (receiver === null) {
        errorMessage = `${receiver} does not exist!`;
        break;
      } else {
        let repayId = uuid.v4();
        let repayInfo = {
          repayId,
          userName: account,
          amount,
          description,
          send: true,
        };
        userInfo.repayHistory.push(repayInfo);

        repayInfo.userName = userName;
        repayInfo.send = false;

        receiver.pendingRepay.push(repayInfo);
        receiver.notificationList.push({
          userName,
          type: "repay:request",
        });
        receivers.push(receiver);
      }
    }
  }

  if (errorMessage === "") {
    await Promise.all([
      ...receivers.map(async (receiver) => await receiver.save()),
      await userInfo.save(),
    ]);
    for (let receiver of receivers) {
      if (cache.has(receiver.userName)) {
        cache.set(receiver.userName, receiver);
      }
    }

    if (cache.has(userName)) {
      cache.set(userName, userInfo);
    }

    return res.status(200).json("Make repay successfully!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const responseRepay = asyncHandler(async (req, res) => {
  const { error, value } = validateResponse(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { accepted, id: repayId } = value;
  let userName = req.user.userName;
  let userInfo = await User.findOne({ userName });
  let errorMessage = "";

  let repay = userInfo.pendingRepay.find((repay) => repay.repayId === repayId);
  if (repay) {
    let sender = await User.findOne({ userName: repay.userName });
    if (sender) {
      let notificationType;
      if (accepted) {
        let debtAccountSummary = sender.debtSummary.summary.find(
          (debtAccount) => debtAccount.userName === userName
        );

        debtAccountSummary.amount = decimalAdd(
          debtAccountSummary.amount,
          -repay.amount
        );
        sender.debtSummary.total = decimalAdd(
          sender.debtSummary.total,
          -repay.amount
        );
        if (debtAccountSummary.amount == 0) {
          sender.debtSummary.summary = sender.debtSummary.summary.filter(
            (debtAccount) => debtAccount.userName !== userName
          );
        }

        repay.accepted = true;
        userInfo.repayHistory.push(repay);
        let senderProcessingRepay = sender.repayHistory.find(
          (processingRepay) => processingRepay.repayId === repayId
        );
        senderProcessingRepay.accepted = true;
        notificationType = "repay:accept";
      } else {
        repay.accepted = false;
        userInfo.repayHistory.push(repay);
        let senderProcessingRepay = sender.repayHistory.find(
          (processingRepay) => processingRepay.repayId === repayId
        );
        senderProcessingRepay.accepted = false;
        notificationType = "repay:decline";
      }
      sender.notificationList.push({
        userName,
        type: notificationType,
      });

      userInfo.pendingRepay = userInfo.pendingRepay.filter(
        (repay) => repay.repayId !== repayId
      );

      await Promise.all([userInfo.save(), sender.save()]);

      if (cache.has(userName)) {
        cache.set(userName, userInfo);
      }
      if (cache.has(sender.userName)) {
        cache.set(sender.userName, sender);
      }
    } else {
      errorMessage = `${repay.userName} does not exist!`;
    }
  } else {
    errorMessage = "Repay does not exist!";
  }

  if (errorMessage === "") {
    return res.status(200).json("Response repay successfully!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const addContact = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: addUserName } = value;
  let userName = req.user.userName;
  let errorMessage = "";

  if (addUserName === userName) {
    errorMessage = "Cannot add yourself!";
  } else {
    let addUser = await User.findOne({ userName: addUserName });

    if (addUser === null) {
      errorMessage = `${addUserName} does not exist!`;
    } else {
      let user = await User.findOne({ userName });
      let contacts = user.contacts.map((contact) => contact.userName);
      if (contacts.includes(addUserName)) {
        errorMessage = `${addUserName} already in your list!`;
      } else {
        user.contacts.push({ userName: addUserName });
        addUser.notificationList.push({ userName, type: "contact:add" });

        await Promise.all([user.save(), addUser.save()]);

        if (cache.has(userName)) {
          cache.set(userName, user);
        }
        if (cache.has(addUserName)) {
          cache.set(addUserName, addUser);
        }
      }
    }
  }

  if (errorMessage === "") {
    return res.status(200).json("Contact added!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
});

const removeContacts = asyncHandler(async (req, res) => {
  const { error, value } = validateRemoveContacts(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { removeContacts } = value;
  let userName = req.user.userName;
  let errorMessage = "";

  let user = await User.findOne({ userName });
  let contacts = user.contacts.map((contact) => contact.userName);

  for (let removeContact of removeContacts) {
    if (removeContact === userName) {
      errorMessage = "Cannot remove yourself!";
      break;
    } else {
      if (!contacts.includes(removeContact)) {
        errorMessage = `${removeContact} is not in your list!`;
        break;
      } else {
        user.contacts = user.contacts.filter(
          (contact) => contact.userName !== removeContact
        );
      }
    }
  }

  if (errorMessage === "") {
    await user.save();

    if (cache.has(userName)) {
      cache.set(userName, user);
    }
    return res.status(200).json("Contact removed!");
  } else {
    return res.status(400).json({ message: errorMessage });
  }
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
    errorMessage = `${receiver} does not exist!`;
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

const deleteNotification = asyncHandler(async (req, res) => {
  const { error, value } = validateUUID(req.query);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { id: notificationId } = value;

  let userName = req.user.userName;
  let user = await User.findOne({ userName });
  user.notificationList = user.notificationList.filter(
    (notification) => notification.notificationId !== notificationId
  );

  await user.save();

  if (cache.has(userName)) {
    cache.set(userName, user);
  }
  return res.status(200).json("Notification deleted!");
});

const markReadNotification = asyncHandler(async (req, res) => {
  let { id } = req.query;
  let userName = req.user.userName;
  let user = await User.findOne({ userName });
  if (id === "all") {
    user.notificationList.forEach((notification) => {
      notification.read = true;
    });
  } else {
    const { error, value } = validateUUID(req.query);

    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid request.", details: error.details });
    }

    let { id: notificationId } = value;
    let notification = user.notificationList.find(
      (notification) => notification.notificationId === notificationId
    );
    notification.read = true;
  }
  await user.save();
  if (cache.has(userName)) {
    cache.set(userName, user);
  }
  return res.status(200).json("Notification updated!");
});

module.exports = {
  getInfo,
  getFavorSummary,
  getDebtSummary,
  getPendingFavor,
  getPendingRepay,
  getFavorHistory,
  getDebtHistory,
  getRepayHistory,
  getContacts,
  getNotificationList,
  getConversationsInfo,
  getConversation,
  searchUser,
  updateInfo,
  makeFavorRequest,
  makeRepayRequest,
  responseFavor,
  responseRepay,
  addContact,
  removeContacts,
  sendMessage,
  deleteConversation,
  deleteNotification,
  markReadNotification,
};
