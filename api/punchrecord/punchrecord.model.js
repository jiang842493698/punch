const mongoose = require('mongoose');

/** 用户单次打卡记录 */
const PunchRecordSchema = new mongoose.Schema({
  gambler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gambler',
    index: true,
  }, 
  punch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Punch',
    index: true,
  },  // 关联的单轮打卡记录ID
  punchDate: Date,      // 打卡日期

  punchDay: {
    type: String,
    default: false
  },  //当前为第几天

  // punchedAt: Date,    // 打卡时间，当status为true时有效

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PunchRecord', PunchRecordSchema);