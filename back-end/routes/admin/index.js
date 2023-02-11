import express from "express";
let router = express.Router();
import User from "../../models/User.js";
import cache from "../../cache.js";

router.post("/sendRecords", async (req, res, next) => {
  try {

    var errorMessage = "";
    let { location, records } = req.body;

    //Iterate through the transaction records list and update database
    for (var record of records) {
      let user = await User.findOne({ userName: record.userName });
      if (user !== null) {
        if (record.amount < user.accountBalance) {

          user.accountBalance = Math.round(parseFloat(user.accountBalance)*100 - record.amount*100) / 100;
          user.expenseHistory.push({
            location: location,
            date: record.date,
            category: record.category,
            amount: record.amount
          });

          await user.save();

        } else {
          errorMessage += record.userName + " account balance not enough\n";
        }
      } else {
        errorMessage += record.userName + " not exists\n";
      }
    }

    if (errorMessage === "") {
      res.status(200).send("Successfully processed records.");
    } else {
      res.status(400).send("Errors:\n" + errorMessage);
    }

  } catch (err) {
    res.status(500).json({ ErrorMessage: err.message });
  }
});

export default router;