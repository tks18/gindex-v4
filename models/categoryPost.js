const mongoose = require('mongoose');

// Category Posters Schema
const categoryPostSchema = {
	root: {
    type: Number,
		required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
		required: true,
  },
  link: {
    type: String,
		required: true,
  },
}

const CategoryPost = mongoose.model("CategoryPost", categoryPostSchema);

module.exports = CategoryPost;
