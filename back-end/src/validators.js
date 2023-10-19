const Joi = require("joi");
const phoneNumberJoi = Joi.extend(require("joi-phone-number"));

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const userNameSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
});

const UUIDSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required(),
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
});

const loginSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).max(50).required(),
});

const searchUserSchema = Joi.object({
  searchQuery: Joi.string().required(),
});

const makeRequestSchema = Joi.object({
  accounts: Joi.array()
    .min(1)
    .unique()
    .items(Joi.string().email().max(50))
    .required(),
  amount: Joi.number().min(1).required(),
  description: Joi.string().max(100),
});

const responseSchema = Joi.object({
  accepted: Joi.boolean().required(),
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required(),
});

const updateInfoSchema = Joi.object({
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
  removeContacts: Joi.array()
    .min(1)
    .unique()
    .items(Joi.string().email().max(50))
    .required(),
});

const sendMessageSchema = Joi.object({
  userName: Joi.string().email().max(50).required(),
  message: Joi.string(),
});

module.exports = {
  validateUserName: validator(userNameSchema),
  validateUUID: validator(UUIDSchema),
  validateRegister: validator(registerSchema),
  validateLogin: validator(loginSchema),
  validateSearchUser: validator(searchUserSchema),
  validateMakeRequest: validator(makeRequestSchema),
  validateResponse: validator(responseSchema),
  validateUpdateInfo: validator(updateInfoSchema),
  validateRemoveContacts: validator(removeContactsSchema),
  validateSendMessage: validator(sendMessageSchema),
};
