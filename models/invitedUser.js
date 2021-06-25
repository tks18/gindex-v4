const mongoose = require('mongoose');

const invitedUserSchema = {
	name: {
    type: String,
    required: true
  },
	post: {
    type: String,
    required: true
  },
	email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
	invitedDate: {
		type: Number,
    required: true,
    default: Date.now,
  },
	message: {
    type: String
  },
	invitedby: {
    type: String,
    lowercase: true,
    required: true
  }
};

const InvitedUser = mongoose.model("InvitedUser", invitedUserSchema);

module.exports = InvitedUser;
