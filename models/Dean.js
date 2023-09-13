// models/dean.js
const mongoose = require('mongoose');

const deanSchema = new mongoose.Schema({
  universityId: { type: String, unique: true },
  password: String,
});

const Dean = mongoose.model('Dean', deanSchema);

module.exports = Dean;
