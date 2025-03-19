// Student model
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  program: { type: String, required: true },
  startingYear: { type: Number, min: 2021, max: 2026, required: true },
});

module.exports = mongoose.model('Student', StudentSchema);
