const request = require("supertest");
const server = require("../../../../index");
const mongoose = require("mongoose");
const app = require("../../../app");
const { clearCacheTimeout } = require("../../../cache");

const senderInfo = {
    username: "tuco@email.com",
    firstName: "Tuco",
    lastName: "Salamanca",
    accountBalance: 5000
}

const receiverInfo = {
    username: "sgoodman@email.com",
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
        userName: senderInfo.username,
        firstName: senderInfo.firstName,
        lastName: senderInfo.lastName,
        accountBalance: senderInfo.accountBalance
    });

    receiver = await request(app).post("/user").send({
        userName: receiverInfo.username,
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
        let url = "/user/"+ senderInfo.username + "/transfer";
        const res = await request(app).post(url).send({
            receiverName: receiverInfo.username,
            amount: transferAmount
        });
        expect(res.statusCode).toBe(200);
    });

    it("should have decreased 500 dollors from Tuco's account", async ()=> {
        const url = "/user/" + senderInfo.username;
        const res = await request(app).get(url).send();
        expect(res.body.accountBalance).toBe(senderInfo.accountBalance - transferAmount);
    });

    it("should have increased 500 dollors in Saul's account", async ()=> {
        const url = "/user/" + receiverInfo.username;
        const res = await request(app).get(url).send();
        expect(res.body.accountBalance).toBe(receiverInfo.accountBalance + transferAmount);
    });

    it("should should send all of Saul's money to Tuco's account", async () => {
        const saul_curr_bal = await (await request(app).get("/user/" + receiverInfo.username).send()).body.accountBalance;
        const tuco_curr_bal = await (await request(app).get("/user/" + senderInfo.username).send()).body.accountBalance;
        let url = "/user/"+ receiverInfo.username + "/transfer";
        const res = await request(app).post(url).send({
            receiverName: senderInfo.username,
            amount: saul_curr_bal
        });
        const send_res = await request(app).get("/user/" + receiverInfo.username).send();
        const recv_res = await request(app).get("/user/" + senderInfo.username).send();
        expect(res.statusCode).toBe(200);
        expect(send_res.body.accountBalance).toBe(0);
        expect(recv_res.body.accountBalance).toBe(saul_curr_bal + tuco_curr_bal);
    });
});