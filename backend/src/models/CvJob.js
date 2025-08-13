const mongoose = require('mongoose');
const CvJobSchema = new mongoose.Schema({
  original: String,
  structured: mongoose.Schema.Types.Mixed,
  formatted: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
module.exports = mongoose.model('CvJob', CvJobSchema);
