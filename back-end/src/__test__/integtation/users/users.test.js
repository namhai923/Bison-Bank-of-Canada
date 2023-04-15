const request = require("supertest");
const server = require("../../../../index");
const mongoose = require("mongoose");
const app = require("../../../app");
const { clearCacheTimeout } = require("../../../cache");


const saul = {
    username: "saul@email.com",
    firstName: "Saul",
    lastName: "Goodman",
    accountBalance: 5000
}

const tuco = {
    username: "tuco@email.com",
    firstName: "Tuco",
    lastName: "Salamanca",
    accountBalance: 15000
}

const ironman = {
    username: "a@email.com",
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
            userName: tuco.username,
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            accountBalance: tuco.accountBalance,
          });
          expect(res.statusCode).toBe(201)
          expect(res.body.userName).toBe(tuco.username)
          expect(res.body.firstName).toBe(tuco.firstName)
          expect(res.body.lastName).toBe(tuco.lastName)
          expect(res.body.accountBalance).toBe(tuco.accountBalance)
    });

    it("should return the correct user information", async ()=> {
        const res = await request(app).get("/user/" + tuco.username).send();
          expect(res.statusCode).toBe(200)
          expect(res.body.userName).toBe(tuco.username)
          expect(res.body.firstName).toBe(tuco.firstName)
          expect(res.body.lastName).toBe(tuco.lastName)
          expect(res.body.accountBalance).toBe(tuco.accountBalance)
    });

    it("should not return the information about an incorrect user - a user that does not exist", async ()=> {
        const res = await request(app).get("/user/" + saul.username).send();
          expect(res.statusCode).toBe(404)
    });

    it("should not create an existing user again", async ()=> {
        const res = await request(app).post("/user").send({
            userName: tuco.username,
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            accountBalance: tuco.accountBalance,
          });
          expect(res.statusCode).toBe(400)
          expect(res.text).toEqual(
            expect.stringContaining("User Already Exists.")
          );
    });

    it("should not create a user with bad information", async ()=> {
        const res = await request(app).post("/user").send({});
          expect(res.statusCode).toBe(500);
    });

    it("should create a user with missing amount and set it to 0", async ()=> {
        const res = await request(app).post("/user").send({
            userName: ironman.username,
            firstName: ironman.firstName,
            lastName: ironman.lastName
          });
          expect(res.statusCode).toBe(201)
    });

    it("should retrieve the the information about the new user with an account balance 0", async ()=> {
        const res = await request(app).get("/user/" + ironman.username).send();
        expect(res.statusCode).toBe(200)
        expect(res.body.userName).toBe(ironman.username)
        expect(res.body.firstName).toBe(ironman.firstName)
        expect(res.body.lastName).toBe(ironman.lastName)
        expect(res.body.accountBalance).toBe(0)
    });

});