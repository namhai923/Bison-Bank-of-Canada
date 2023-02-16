const request = require("supertest");
const server = require("../../index");
const mongoose = require("mongoose");
const app = require("../app");

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
  server.close();
});

describe("Testing User index", () => {

  const userName = "newuser@gmail.com";
  const firstName = "new";
  const lastName = "user";
  const originalBalance = 1000;
  const transferAmount = 30.55;
  const amountLarge = 2000;
  const receiverUserName = "anotheruser@gmail.com";
  const receiverFirstName = "another";
  const receiverLastName = "user";
  
  it("/Post /user Should create a user", async () => {
    const res = await request(app).post("/user").send({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      accountBalance: originalBalance,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.userName).toBe(userName);
  });

  it("/Post /user Should return user exist", async () => {
    const res = await request(app).post("/user").send({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      accountBalance: originalBalance,
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe("User Already Exists.");
  });

  it("/Get /user Should return user information", async () => {
    const res = await request(app).get("/user/" + userName).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.userName).toBe(userName);
    expect(res.body.firstName).toBe(firstName);
    expect(res.body.lastName).toBe(lastName);
  });

  it("/Get /user Should return user not found", async () => {
    const res = await request(app).get("/user/" + "randomeUser").send();
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("User Not Found.");
  });

  it("/Post /user/{userName}/transfer fail with no receiver found", async () =>{
    const res = await request(app).post("/user/" + userName + "/transfer").send({
      receiverName: receiverUserName,
      amount: 0,
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("Transfer failed: " + receiverUserName + " does not exists"));
  });

  it("/POST /user create transfer receiver success", async () => {
    const res = await request(app).post("/user").send({
      userName: receiverUserName,
      firstName: receiverFirstName,
      lastName: receiverLastName,
      accountBalance: originalBalance,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.userName).toBe(receiverUserName);
  });

  it("/Post /user/{userName}/transfer fail with amount less than 0", async () =>{
    const res = await request(app).post("/user/" + userName + "/transfer").send({
      receiverName: receiverUserName,
      amount: -1,
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("Transfer failed: transfer amount must be greater than 0."));
  });

  it("/Post /user/{userName}/transfer fail with amount less than 0", async () =>{
    const res = await request(app).post("/user/" + userName + "/transfer").send({
      receiverName: receiverUserName,
      amount: amountLarge,
    });
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("Transfer failed: " + userName + " account balance not enough"));
  });

  it("/Post /user/{userName}/transfer success", async () =>{
    const res = await request(app).post("/user/" + userName + "/transfer").send({
      receiverName: receiverUserName,
      amount: transferAmount,
    });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Successfully processed transfer");
  });

  it("/Get check user balance after transfer", async () =>{
    const sender = await request(app).get("/user/" + userName).send();
    const receiver = await request(app).get("/user/" + receiverUserName).send();
    expect(sender.body.accountBalance).toBe(originalBalance - transferAmount);
    expect(receiver.body.accountBalance).toBe(originalBalance + transferAmount);
  });

});
