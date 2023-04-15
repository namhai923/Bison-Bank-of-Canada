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

let tuco_user = {}
beforeAll(async() => {
    // Creating new users
    tuco_user = await request(app).post("/user").send({
        userName: tuco.username,
        firstName: tuco.firstName,
        lastName: tuco.lastName,
        accountBalance: tuco.accountBalance
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

    it("should not allow to update a profile with a null dob", async ()=> {
        const res = await request(app).post("/user/" + tuco.username).send({
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            dob: null,
            phoneNumber: tuco.phoneNumber
          });
        expect(res.statusCode).toBe(500)
        expect(res.text).toEqual(
            expect.stringContaining("Missing require parameter in request body.")
        );
    });

    it("should not allow to update a profile with a null phone number", async ()=> {
        const res = await request(app).post("/user/" + tuco.username).send({
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            dob: tuco.dob,
            phoneNumber: null
          });
        expect(res.statusCode).toBe(500)
        expect(res.text).toEqual(
            expect.stringContaining("Missing require parameter in request body.")
        );
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