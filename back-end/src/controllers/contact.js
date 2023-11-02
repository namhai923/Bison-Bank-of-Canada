const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { connectedUsers, getUser } = require("../utilities");
const { validateUserName, validateRemoveContacts } = require("../validators");

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

module.exports = {
  getContacts,
  addContact,
  removeContacts,
};
