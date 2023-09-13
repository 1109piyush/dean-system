// models/student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  universityId: { type: String, unique: true },
  password: String,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
