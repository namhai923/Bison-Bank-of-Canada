const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: "Too many login from this IP, please try again after a minute",
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({ message: options.message });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
