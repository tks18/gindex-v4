const mongoose = require('mongoose');

// Category Posters Schema
const quickLinkSchema = {
	root: {
    type: Number,
		required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
		required: true,
  },
}

const QuickLink = mongoose.model("QuickLink", quickLinkSchema);

module.exports = QuickLink;
