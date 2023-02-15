const request = require("supertest");

const app = require("../app");

test("hope that it works", async () => {
  await request(app)
    .post("/user")
    .send({
      userName: "newuser",
      firstName: "new",
      lastName: "user",
    })
    .expect(200);
});
