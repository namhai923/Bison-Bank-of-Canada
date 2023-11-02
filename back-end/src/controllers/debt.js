const asyncHandler = require("express-async-handler");

const { getUser } = require("../utilities");

const getDebtSummary = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { debtSummary } = userInfo.toJSON();
  return res.status(200).json(debtSummary);
});

const getDebtHistory = asyncHandler(async (req, res) => {
  let userName = req.user.userName;
  let userInfo = await getUser(userName);

  let { debtHistory } = userInfo.toJSON();
  return res.status(200).json(debtHistory);
});

module.exports = {
  getDebtSummary,
  getDebtHistory,
};
