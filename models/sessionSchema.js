const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  sessionid: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true,
  }
})

module.exports = sessionSchema;
