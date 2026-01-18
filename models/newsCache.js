const mongoose = require('mongoose');

const newsCacheSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true // One document per category (e.g., 'technology')
  },
  articles: [],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NewsCache', newsCacheSchema);