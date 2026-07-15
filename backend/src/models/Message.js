const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    encryptedMessage: { type: String, required: true },
    iv: { type: String },
    authTag: { type: String },
    algorithm: { type: String },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'timestamp', updatedAt: true } }
);

module.exports = mongoose.model('Message', messageSchema);
