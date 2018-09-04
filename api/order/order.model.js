const mongoose = require('mongoose');

/**
 * Order Schema
 */
const OrderSchema = new mongoose.Schema({
  gambler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gambler',
    index: true
  },
  body: String,
  totalFee: Number,
  refundFee: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef Order
 */
module.exports = mongoose.model('Order', OrderSchema);
