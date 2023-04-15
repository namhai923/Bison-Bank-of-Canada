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

});

describe("Testing updating user profile", () => {
    it("should update the user's profile to add their dob and phone number", async ()=> {
        let d = new Date('2001-01-04')
        tuco.dob = d.toISOString()
        tuco.phoneNumber = "1234567890"
        const res = await request(app).post("/user/" + tuco.username).send({
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            dob: tuco.dob,
            phoneNumber: tuco.phoneNumber
          });
          expect(res.statusCode).toBe(200)

        const updatedProfile = await request(app).get("/user/" + tuco.username).send();
        expect(updatedProfile.statusCode).toBe(200)
        expect(updatedProfile.body.userName).toBe(tuco.username)
        expect(updatedProfile.body.firstName).toBe(tuco.firstName)
        expect(updatedProfile.body.lastName).toBe(tuco.lastName)
        expect(updatedProfile.body.accountBalance).toBe(tuco.accountBalance)
        expect(updatedProfile.body.dob).toBe(tuco.dob)
        expect(updatedProfile.body.phoneNumber).toBe(tuco.phoneNumber)
    });

    it("should not allow to update the non existent user", async ()=> {
        let d = new Date('2001-11-04')
        saul.dob = d.toISOString()
        saul.phoneNumber = "1234567870"
        const res = await request(app).post("/user/" + saul.username).send({
            firstName: saul.firstName,
            lastName: saul.lastName,
            dob: saul.dob,
            phoneNumber: saul.phoneNumber
          });
          expect(res.statusCode).toBe(404)
          expect(res.text).toEqual(
            expect.stringContaining("User Not Found.")
          );
    });
    
});