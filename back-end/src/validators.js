const Joi = require("joi");
const phoneNumberJoi = Joi.extend(require("joi-phone-number"));

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const userNameSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
});

const registerSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).max(50).required(),
  firstName: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  lastName: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  accountBalance: Joi.number().min(0).max(100000).integer().required(),
});

const loginSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).max(50).required(),
});

const expenseSchema = Joi.object({
  location: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  category: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  amount: Joi.number().min(1).required(),
});

const transferSchema = Joi.object({
  transferAccounts: Joi.array().items(Joi.string().email().max(50)).required(),
  amount: Joi.number().min(1).required(),
});

const profileSchema = Joi.object({
  firstName: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  lastName: Joi.string()
    .max(50)
    .pattern(new RegExp(/^[aA-zZs]+$/))
    .required(),
  dob: Joi.date().max(new Date()).allow(""),
  phoneNumber: phoneNumberJoi.string().phoneNumber().allow(""),
});

const removeContactsSchema = Joi.object({
  removeContacts: Joi.array().items(Joi.string().email().max(50)).required(),
});

const sendMessageSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
  message: Joi.string(),
});

module.exports = {
  validateUserName: validator(userNameSchema),
  validateRegister: validator(registerSchema),
  validateLogin: validator(loginSchema),
  validateExpense: validator(expenseSchema),
  validateTransfer: validator(transferSchema),
  validateProfile: validator(profileSchema),
  validateRemoveContacts: validator(removeContactsSchema),
  validateSendMessage: validator(sendMessageSchema),
};
