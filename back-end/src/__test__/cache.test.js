const { cache, setCacheExpire } = require("../cache");
const {jest: requiredJest} = require('@jest/globals');

describe("Testing Cache", () => {

  var userName = "randomUserEmail@email.com"
  var user = {
    userName: userName,
    firstName: "firstName",
    astName: "lastName",
  }

  it("Cache should be set and exist", async () => {
    cache.set(userName, user);
    var result = cache.get(userName);
    expect(result).toBe(user);
  });

  it("Cache should return undefined", async () => {
    var result = cache.get("userName");
    expect(result).toBe(undefined);
  });

  it("Test set cache expire and deleted after", async () => {
    requiredJest.useFakeTimers();
    setCacheExpire(userName, 1);
    requiredJest.runAllTimers();
    expect(cache.has(userName)).toBe(false);
  },20000);

  it("Test set cache expire fail because cache not exist", async () => {
    const logSpy = jest.spyOn(global.console, 'log');
    requiredJest.useFakeTimers();
    setCacheExpire(userName, 1);
    requiredJest.runAllTimers();
    expect(logSpy).toHaveBeenCalledWith("Set Cache Expired Failed: " + userName + " not in Cache");
  },20000);
});