const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definin a scheman for users
const userSchema = new Schema({
  username: String,
  email: String,
  requests: Array,
  friends: Array,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
