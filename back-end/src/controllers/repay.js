const asyncHandler = require("express-async-handler");
const uuid = require("uuid");

const User = require("../models/user.model");
const { cache } = require("../cache");
const { validateResponse, validateMakeRequest } = require("../validators");
const { getUser, decimalAdd } = require("../utilities");

const getPendingRepay = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { pendingRepay } = userInfo.toJSON();
  return res.status(200).json(pendingRepay);
});

const getRepayHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { repayHistory } = userInfo.toJSON();
  return res.status(200).json(repayHistory);
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
        errorMessage = `${account} does not exist!`;
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

module.exports = {
  getPendingRepay,
  getRepayHistory,
  makeRepayRequest,
  responseRepay,
};
