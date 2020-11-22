const mongoose = require('mongoose');

// Pending User Database Model
const pendingUserSchema = {
	name: {
    type: String,
    required: true
  },
	post: {
    type: String,
    required: true
  },
	drive: {
		type: Number,
		required: true,
	},
	pendingFrom: {
		type: Number,
    required: true,
    default: Date.now,
  },
	email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true },
	message: {
    type: String
  }
};

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

module.exports = PendingUser;
