const mongoose = require('mongoose');
const Sessions = require('./sessionSchema');

// User Database Model
const userSchema = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    lowercase: true,
  },
  registeredDate: {
    type: Number,
    required: true,
    default: Date.now,
  },
	password: {
    type: String,
    default: null
  },
	temppassword: {
    type: String
  },
	temprestricted: {
    type: Boolean,
    default: false
  },
	role: {
    type: String,
    required: true,
    default: 'user'
  },
  sessions: [Sessions],
	admin: {
    type: Boolean,
    required: true,
    default: false
  },
	superadmin: {
    type: Boolean,
    required: true,
    default: false
  },
	verified: {
    type: Boolean,
    required: true,
    default: false
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
