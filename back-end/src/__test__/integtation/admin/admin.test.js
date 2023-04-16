const request = require("supertest");
const server = require("../../../../index");
const mongoose = require("mongoose");
const app = require("../../../app");
const { clearCacheTimeout } = require("../../../cache");

const locationName = "superstore";
const userNameList = ["user1@gmail.com", "user2@gmail.com","user3@gmail.com","user4@gmail.com","user5@gmail.com"];
const expenseAmountList = [40.35, 50.67, 199.24, 53.10, 44.30];
const amountLarge = 2000;
const firstName = "new";
const lastName = "user";
const originalBalance = 1000;

beforeAll(async() => {
  //Create users beforehand for testing purpose
  for(let userName of userNameList){
    await request(app).post("/user").send({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      accountBalance: originalBalance,
    });
  }
})

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  clearCacheTimeout();
  await mongoose.connection.close();
  server.close();
});

describe("Testing send transaction records", () => {

  it("/Post /sendRecords sendRecord with invalid body", async () => {
    const res = await request(app).post("/admin/sendRecords").send("Invalid body");
    expect(res.statusCode).toBe(500);
    expect(res.text).toEqual(expect.stringContaining("Missing require parameter in request body."));
  });

  it("/Post /sendRecords sendRecord success", async () => {
    const res = await request(app).post("/admin/sendRecords").send(setUpExpenseRecord());
    expect(res.statusCode).toBe(200);
  });

  it("Check user accountBalance deducted", async() => {
    for(let i=0; i<userNameList.length; i++){
      const res = await request(app).get("/user/" + userNameList[i]).send();
      expect(res.body.accountBalance).toBe(originalBalance - expenseAmountList[i]);
    }
  });

  it("Check user expenseHistory exists and information(amount, location, etc) match", async() => {
    for(let i=0; i<userNameList.length; i++){
      const res = await request(app).get("/user/" + userNameList[i]).send();
      expect(res.body.expenseHistory[0].amount).toBe(expenseAmountList[i]);
      expect(res.body.expenseHistory[0].location).toBe(locationName);
    }
  });
});

function setUpExpenseRecord(){
  var expenseRecord = {
    location: locationName,
    records: []
  }
  for(let i=0; i<userNameList.length; i++){
    expenseRecord.records.push({
      userName: userNameList[i],
      date: Date.now(),
      amount: expenseAmountList[i],
      category: "food"
    })
  }
  return expenseRecord;
}