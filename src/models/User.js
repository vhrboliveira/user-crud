const mongoose = require('mongoose');
const uuid = require('uuid').v4;

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuid },
  email: String,
  givenName: String,
  familyName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
