const request = require("supertest");
const server = require("../../../../index");
const mongoose = require("mongoose");
const app = require("../../../app");
const { clearCacheTimeout } = require("../../../cache");

const senderInfo = {
    userName: "tuco@email.com",
    firstName: "Tuco",
    lastName: "Salamanca",
    accountBalance: 5000
}

const receiverInfo = {
    userName: "sgoodman@email.com",
    firstName: "Saul",
    lastName: "Goadman",
    accountBalance: 10000
}

const transferAmount = 500.25;
let sender = {};
let receiver = {};

beforeAll(async() => {
    // Create a sender user and a receiver user
    sender  = await request(app).post("/user").send({
        userName: senderInfo.userName,
        firstName: senderInfo.firstName,
        lastName: senderInfo.lastName,
        accountBalance: senderInfo.accountBalance
    });

    receiver = await request(app).post("/user").send({
        userName: receiverInfo.userName,
        firstName: receiverInfo.firstName,
        lastName: receiverInfo.lastName,
        accountBalance: receiverInfo.accountBalance
    });
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

describe("Sending Money from Tuco Salamanca to Saul Goodman", () => {
    it("should reduce 100 dollors from Tuco's account and increment 100 dollors in Saul's account", async () => {
        let url = "/user/"+ senderInfo.userName + "/transfer";
        const res = await request(app).post(url).send({
            receiverName: receiverInfo.userName,
            amount: transferAmount
        });
        expect(res.statusCode).toBe(200);
    });

    it("should have decreased 500 dollors from Tuco's account", async ()=> {
        const url = "/user/" + senderInfo.userName;
        const res = await request(app).get(url).send();
        expect(res.body.accountBalance).toBe(senderInfo.accountBalance - transferAmount);
    });

    it("should have increased 500 dollors in Saul's account", async ()=> {
        const url = "/user/" + receiverInfo.userName;
        const res = await request(app).get(url).send();
        expect(res.body.accountBalance).toBe(receiverInfo.accountBalance + transferAmount);
    });

    it("should should send all of Saul's money to Tuco's account", async () => {
        const saulCurrBal = await (await request(app).get("/user/" + receiverInfo.userName).send()).body.accountBalance;
        const tucoCurrBal = await (await request(app).get("/user/" + senderInfo.userName).send()).body.accountBalance;
        let url = "/user/"+ receiverInfo.userName + "/transfer";
        const res = await request(app).post(url).send({
            receiverName: senderInfo.userName,
            amount: saulCurrBal
        });
        const sendRes = await request(app).get("/user/" + receiverInfo.userName).send();
        const recvRes = await request(app).get("/user/" + senderInfo.userName).send();
        expect(res.statusCode).toBe(200);
        expect(sendRes.body.accountBalance).toBe(0);
        expect(recvRes.body.accountBalance).toBe(saulCurrBal + tucoCurrBal);
    });
});