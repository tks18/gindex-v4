const mongoose = require('mongoose');

// Trending Posters Schema
const trendingPostSchema = {
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

const TrendingPost = mongoose.model("TrendingPost", trendingPostSchema);

module.exports = TrendingPost;
