const request = require("supertest");
const server = require("../../../../index");
const mongoose = require("mongoose");
const app = require("../../../app");
const { clearCacheTimeout } = require("../../../cache");

const tuco = {
    userName: "tuco@email.com",
    firstName: "Tuco",
    lastName: "Salamanca",
    accountBalance: 15000
}

const ironman = {
    userName: "a@email.com",
    firstName: "Ironman",
    lastName: "Avengers"
}

afterAll(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
    clearCacheTimeout();
    await mongoose.connection.close();
    server.close();
});

describe("Creating users", ()=> {
    it("should create a new user named Tuco Salamanca", async ()=> {
        const res = await request(app).post("/user").send({
            userName: tuco.userName,
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            accountBalance: tuco.accountBalance,
          });
          expect(res.statusCode).toBe(201)
          expect(res.body.userName).toBe(tuco.userName)
          expect(res.body.firstName).toBe(tuco.firstName)
          expect(res.body.lastName).toBe(tuco.lastName)
          expect(res.body.accountBalance).toBe(tuco.accountBalance)
    });

    it("should return the correct user information", async ()=> {
        const res = await request(app).get("/user/" + tuco.userName).send();
          expect(res.statusCode).toBe(200)
          expect(res.body.userName).toBe(tuco.userName)
          expect(res.body.firstName).toBe(tuco.firstName)
          expect(res.body.lastName).toBe(tuco.lastName)
          expect(res.body.accountBalance).toBe(tuco.accountBalance)
    });

    it("should create a user with missing amount and set it to 0", async ()=> {
        const res = await request(app).post("/user").send({
            userName: ironman.userName,
            firstName: ironman.firstName,
            lastName: ironman.lastName
          });
          expect(res.statusCode).toBe(201)
    });

    it("should retrieve the the information about the new user with an account balance 0", async ()=> {
        const res = await request(app).get("/user/" + ironman.userName).send();
        expect(res.statusCode).toBe(200)
        expect(res.body.userName).toBe(ironman.userName)
        expect(res.body.firstName).toBe(ironman.firstName)
        expect(res.body.lastName).toBe(ironman.lastName)
        expect(res.body.accountBalance).toBe(0)
    });

});