const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache, setCacheExpire } = require("../cache");
const { CACHE_EXPIRED_IN_SECONDS } = require("../config/vars.config");
const {
  validateUserName,
  // validateExpense,
  // validateTransfer,
  validateFavor,
  validateDebt,
  validateProfile,
  validateRemoveContacts,
  validateSendMessage,
} = require("../validators");

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

// const getBalance = asyncHandler(async (req, res) => {
//   let userName = req.user.userName;
//   let userInfo = await getUser(userName);

//   let { accountBalance } = userInfo.toJSON();
//   return res.status(200).json(accountBalance);
// });

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

const getContacts = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { contacts } = userInfo.toJSON();
  let contactsInfo = await Promise.all(
    contacts.map(async (contact) => {
      let contactInfo = await getUser(contact.userName);
      let { userName, firstName, lastName, active } = contactInfo.toJSON();
      return { userName, firstName, lastName, active };
    })
  );
  return res.status(200).json(contactsInfo);
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

const updateInfo = asyncHandler(async (req, res) => {
  const { error, value } = validateProfile(req.body);

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

// const expense = asyncHandler(async (req, res) => {
//   const { error, value } = validateExpense(req.body);

//   if (error) {
//     return res
//       .status(400)
//       .json({ message: "Invalid request.", details: error.details });
//   }

//   let { location, category, amount } = value;
//   let userName = req.user.userName;

//   let user = await User.findOne({ userName });
//   if (user.accountBalance >= amount) {
//     user.accountBalance =
//       Math.round(parseFloat(user.accountBalance * 100) - amount * 100) / 100;

//     let newExpense = {
//       location,
//       category,
//       amount,
//       date: Date.now(),
//     };

//     user.expenseHistory.push(newExpense);

//     await user.save();

//     //Update cache`
//     if (cache.has(userName)) {
//       cache.set(userName, user);
//     }
//     return res.status(200).json("Expense successfully!");
//   } else {
//     return res.status(400).json({ message: "Account balance not enough." });
//   }
// });

// const transfer = asyncHandler(async (req, res) => {
//   const { error, value } = validateTransfer(req.body);

//   if (error) {
//     return res
//       .status(400)
//       .json({ message: "Invalid request.", details: error.details });
//   }

//   let { transferAccounts, amount } = value;
//   let senderName = req.user.userName;
//   let errorMessage = "";
//   let receivers = [];

//   let sender = await User.findOne({ userName: senderName });
//   let totalAmount = amount * transferAccounts.length;

//   if (sender.accountBalance >= totalAmount) {
//     sender.accountBalance =
//       Math.round(parseFloat(sender.accountBalance * 100) - totalAmount * 100) /
//       100;
//   } else {
//     return res.status(400).json({ message: "Account balance not enough!" });
//   }

//   for (let receiverName of transferAccounts) {
//     if (receiverName === senderName) {
//       errorMessage = "Cannot transfer to yourself!";
//       break;
//     } else {
//       let receiver = await User.findOne({ userName: receiverName });
//       if (receiver === null) {
//         errorMessage = `${receiverName} does not exist!`;
//         break;
//       } else {
//         let newTransfer = {
//           sender: senderName,
//           receiver: receiverName,
//           date: Date.now(),
//           amount: amount,
//         };
//         receiver.accountBalance =
//           Math.round(parseFloat(receiver.accountBalance * 100) + amount * 100) /
//           100;

//         sender.transferHistory.push(newTransfer);
//         receiver.transferHistory.push(newTransfer);
//         receivers.push(receiver);
//       }
//     }
//   }

//   if (errorMessage === "") {
//     for (let receiver of receivers) {
//       await receiver.save();
//       if (cache.has(receiver.userName)) {
//         cache.set(receiver.userName, receiver);
//       }
//     }
//     await sender.save();
//     if (cache.has(senderName)) {
//       cache.set(senderName, sender);
//     }
//     return res.status(200).json("Transfer successfully!");
//   } else {
//     return res.status(400).json({ message: errorMessage });
//   }
// });

const makeFavor = asyncHandler(async (req, res) => {});

const payDebt = asyncHandler(async (req, res) => {});

const acceptFavor = asyncHandler(async (req, res) => {});

const acceptDebt = asyncHandler(async (req, res) => {});

const declineFavor = asyncHandler(async (req, res) => {});

const declineDebt = asyncHandler(async (req, res) => {});

const addContact = asyncHandler(async (req, res) => {
  const { error, value } = validateUserName(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid request.", details: error.details });
  }

  let { userName: addedContact } = value;
  let userName = req.user.userName;
  let errorMessage = "";

  if (addedContact === userName) {
    errorMessage = "Cannot add yourself!";
  } else {
    let addUser = await getUser(addedContact);

    if (addUser === null) {
      errorMessage = `${addedContact} does not exist!`;
    } else {
      let user = await User.findOne({ userName });
      let contacts = user.contacts.map((contact) => contact.userName);
      if (contacts.includes(addedContact)) {
        errorMessage = `${addedContact} already in your list!`;
      } else {
        user.contacts.push({ userName: addedContact });
        await user.save();

        if (cache.has(userName)) {
          cache.set(userName, user);
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

    await sender.save();
    if (cache.has(senderName)) {
      cache.set(senderName, sender);
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

    await receiver.save();
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
  return res.status(200).json("Conversation removed!");
});

module.exports = {
  getInfo,
  // getBalance,
  getFavorSummary,
  getDebtSummary,
  // getExpense,
  // getTransfer,
  getFavorHistory,
  getDebtHistory,
  getContacts,
  getConversationsInfo,
  getConversation,
  updateInfo,
  // expense,
  // transfer,
  makeFavor,
  payDebt,
  acceptFavor,
  acceptDebt,
  declineFavor,
  declineDebt,
  addContact,
  removeContacts,
  sendMessage,
  deleteConversation,
};
