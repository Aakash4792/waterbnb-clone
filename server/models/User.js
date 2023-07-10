const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: String,
  name: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
