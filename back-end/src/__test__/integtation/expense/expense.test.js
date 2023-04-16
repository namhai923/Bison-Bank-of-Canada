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

describe("Testing adding expenses", () => {
    let expense1 = {
        location: "Superstore",
        category: "Food",
        amount: 10
    }
    it("should create a new expense for {tuco.firstName} {tuco.lastName}", async () => {
        const res = await request(app).post("/user/" + tuco.userName + "/expense").send({
            location: expense1.location,
            category: expense1.category,
            amount: expense1.amount,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.location).toBe(expense1.location);
        expect(res.body.category).toBe(expense1.category);
        expect(res.body.amount).toBe(expense1.amount);
    });

    it("{tuco.firstName} {tuco.lastName}'s expense history must be stored by now", async () => {
        const res = await request(app).get("/user/" + tuco.userName).send();
        let expenseList = res.body.expenseHistory;
        let d = expenseList[0].date.split('T')[0]
        let today = new Date()
        today = today.toISOString().split('T')[0]

        expect(res.statusCode).toBe(200);
        expect(expenseList[0].location).toBe(expense1.location)
        expect(expenseList[0].category).toBe(expense1.category)
        expect(expenseList[0].amount).toBe(expense1.amount)
        expect(d).toBe(today)
    });

    it("should have reduced 10 dollors for {tuco.firstName} {tuco.lastName}'s account", async ()=>{
        let tucoBeforeBalance = tuco.accountBalance
        const res = await request(app).get("/user/" + tuco.userName).send()
        expect(res.body.accountBalance).toBe(tucoBeforeBalance-10)
    });
});


