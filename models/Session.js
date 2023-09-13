// models/session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  studentId: String,
  deanId: String,
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
