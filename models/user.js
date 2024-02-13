const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passsportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
UserSchema.plugin(passsportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
