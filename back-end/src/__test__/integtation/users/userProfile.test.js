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

beforeAll(async() => {
    // Creating new users
    await request(app).post("/user").send({
        userName: tuco.userName,
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
        const res = await request(app).post("/user/" + tuco.userName).send({
            firstName: tuco.firstName,
            lastName: tuco.lastName,
            dob: tuco.dob,
            phoneNumber: tuco.phoneNumber
          });
          expect(res.statusCode).toBe(200)

        const updatedProfile = await request(app).get("/user/" + tuco.userName).send();
        expect(updatedProfile.statusCode).toBe(200)
        expect(updatedProfile.body.userName).toBe(tuco.userName)
        expect(updatedProfile.body.firstName).toBe(tuco.firstName)
        expect(updatedProfile.body.lastName).toBe(tuco.lastName)
        expect(updatedProfile.body.accountBalance).toBe(tuco.accountBalance)
        expect(updatedProfile.body.dob).toBe(tuco.dob)
        expect(updatedProfile.body.phoneNumber).toBe(tuco.phoneNumber)
    });
    
});