const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { validateResponse, validateMakeRequest } = require("../validators");
const { getUser, decimalAdd } = require("../utilities");

const getFavorSummary = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { favorSummary } = userInfo.toJSON();
  return res.status(200).json(favorSummary);
});

const getPendingFavor = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { pendingFavor } = userInfo.toJSON();
  return res.status(200).json(pendingFavor);
});

const getFavorHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { favorHistory } = userInfo.toJSON();
  return res.status(200).json(favorHistory);
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
        errorMessage = `${account} does not exist!`;
        break;
      } else {
        if (
          userInfo.debtSummary.summary.some(
            (userSummary) => userSummary.userName === account
          )
        ) {
          errorMessage = `Pay your debt with ${account} first`;
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
        sender.creditPoints = sender.creditPoints + parseInt(favor.amount);

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

module.exports = {
  getFavorSummary,
  getPendingFavor,
  getFavorHistory,
  makeFavorRequest,
  responseFavor,
};
