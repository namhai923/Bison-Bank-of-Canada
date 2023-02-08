import express from "express";
let router = express.Router();
import User from "../../models/User.js";
import cache from "../../cache.js";

router.post("/sendRecords", async (req, res, next) => {
    // check if the username exist, then return user data
    try {
        
        var errorMessage = "";
        let { location, records } = req.body;
        for(var record of records) {
            let user = await User.findOne({ userName: record.userName });
            if(user !== null){
                if(record.amount < user.accountBalance){
                    user.accountBalance -= record.amount;

                    user.expenseHistory.push({
                        location : location,
                        date : record.date,
                        category : record.category,
                        amount : record.amount
                    });

                    await user.save();
                }else{
                    errorMessage += record.userName + " account balance not enough\n";
                    console.log("1" + errorMessage);
                }
            }else{
                errorMessage += record.userName + " not exists\n";
            }
        }

        console.log("2" + errorMessage);
        if(errorMessage === ""){
            res.status(200).send("Successfully processed records.");
        }else{
            res.status(400).send("Errors:\n" + errorMessage);
        }
    } catch (err) {
      res.status(500).json({ ErrorMessage: err.message });
    }
  });

  export default router;