const request = require("supertest");
const server = require("../../index");
const mongoose = require("mongoose");
const app = require("../app");

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe("POST /user", () => {
  it("Should create a user", async () => {
    const res = await request(app).post("/user").send({
      userName: "newuser@gmail.com",
      firstName: "new",
      lastName: "user",
    });
    expect(res.statusCode).toBe(200);
  });
});
