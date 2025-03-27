const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['youtube', 'research', 'twitter'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 