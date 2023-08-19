const mongoose = require("mongoose");

let credentialSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "Credentials" }
);

module.exports = mongoose.model("Credential", credentialSchema);
