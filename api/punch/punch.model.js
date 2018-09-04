const mongoose = require('mongoose');

const PunchSchema = new mongoose.Schema({
    gambler: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Gambler',
        index: true,
    },      // 玩家ID
    order: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        index: true,
    },      // 订单的ID
    active: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Active',
        index: true,
    },      // 活动的ID
    startTime: {
        type:String,
    },      // 开始时间
    endTime: {
        type:String,
    },      //结束时间
    isPunching: {
        type: Boolean,
        default: true
    },      // 用户是否正在参与本轮打卡
    startDate: Date,      // 开始日期
    endDate: Date,        // 结束日期
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Punch', PunchSchema);