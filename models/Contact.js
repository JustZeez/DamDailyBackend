const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  message: {
    type: String,
    required: [true, "Message content is required"]
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact