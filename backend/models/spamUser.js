const mongoose = require('mongoose');

const spamUserSchema = {
	name: {
    type: String,
    required: true
  },
	email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
	post: {
    type: String,
    required: true
  },
	flaggedby: {
    type: String,
    required: true,
    lowercase: true
  },
	reason: {
    type: String,
    required: true
  }
}

const SpamUser = mongoose.model("SpamUser", spamUserSchema);

module.exports = SpamUser;
