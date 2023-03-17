const request = require("supertest");
const server = require("../../../index");
const mongoose = require("mongoose");
const app = require("../../app");
const { clearCacheTimeout } = require("../../cache");
const User = require("../../models/user.model");

const userName = "newuser@gmail.com";
const firstName = "new";
const lastName = "user";

beforeAll(async () => {
  await request(app).post("/user").send({
    userName: userName,
    firstName: firstName,
    lastName: lastName,
  });
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  clearCacheTimeout();
  await mongoose.connection.close();
  server.close();
});

describe("Testing User Model", () => {
  it("User should not contain certain field like id or __v after cleanning", async () => {
    let user = await User.findOne({ userName: userName });
    let cleanedUser = user.toJSON();
    expect(cleanedUser.userName).toBe(userName);
    expect(cleanedUser.firstName).toBe(firstName);
    expect(cleanedUser.lastName).toBe(lastName);
    expect(cleanedUser.__v).toBe(undefined);
    expect(cleanedUser._id).toBe(undefined);
    expect(cleanedUser.id).toBe(undefined);
  });

});