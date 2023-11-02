let cache = new Map();

let timeouts = [];

function setCacheExpire(userName, timeInSeconds) {
  if (cache.has(userName)) {
    var id = setTimeout(() => {
      if (cache.delete(userName)) {
        console.log("Cache for " + userName + " expired and deleted.");
      } else {
        console.log(
          "Cache deletion failed for " +
            userName +
            " failed: it might be because user already signed out and cache was deleted already."
        );
      }
    }, timeInSeconds * 1000);
    timeouts.push(id);
  } else {
    console.log("Set Cache Expired Failed: " + userName + " not in Cache");
  }
}

function clearCacheTimeout() {
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

module.exports = { cache, setCacheExpire, clearCacheTimeout };
