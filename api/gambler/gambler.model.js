const mongoose = require('mongoose');

/**
 * Gambler Schema
 */
const GamblerSchema = new mongoose.Schema({
  openId: {
    type: String,
    index: true
  },       // 微信用户OpenId
  sessionKey: String,   // 微信用户sessionKey
  nickName: String,
  avatarUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef Player
 */
module.exports = mongoose.model('Gambler', GamblerSchema);
