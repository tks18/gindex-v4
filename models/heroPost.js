const mongoose = require('mongoose');

// Hero Posters Schema
const heroPostSchema = {
	root: {
    type: Number,
		required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
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

const HeroPost = mongoose.model("HeroPost", heroPostSchema);

module.exports = HeroPost;
