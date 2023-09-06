const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//console.log("userSchema", userSchema);

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  

module.exports = mongoose.model("User", userSchema);
