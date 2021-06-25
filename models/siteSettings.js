const mongoose = require('mongoose');

const siteSettingsSchema = {
  cId: {
    type: String,
    required: true,
    default: process.env.FRONTENDSITENAME
  },
  requests: {
    type: Boolean,
    required: true,
    default: true,
  },
  adminRequests: {
    type: Boolean,
    required: true,
    default: true,
  },
  tmdb: {
    type: Boolean,
    required: true,
    default: false,
  }
}

const Settings = mongoose.model("Settings", siteSettingsSchema);

module.exports = Settings;
