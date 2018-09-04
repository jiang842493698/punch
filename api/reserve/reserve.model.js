const mongoose = require('mongoose');

const ReserveSchema = new mongoose.Schema({
  punch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Punch',
    index: true,
  },              //关联的打卡记录
  gambler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gambler',
    index: true,
  },              //关联的用户记录
  reserveAt: {
    type: Date,
    required: true
  },              //预约提醒时间
  reserveDate: {
    type: Date,
    required: true
  },              //预约的时间

  reserveDay: {
    type: String,
    required: true
  },              //当前为第几天

  formId: {
    type: String,
    required: true
  },              //发送模板消息存进来的
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Reserve', ReserveSchema);