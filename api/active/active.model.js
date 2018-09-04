const mongoose = require('mongoose');

const ActiveSchema = new mongoose.Schema({
    gambler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gambler',
        index: true
    }, // 关联的创建者用户

    name: {
        type: String,
        required: true,
    }, // 活动的名称

    status: {
        type: Boolean,
        default: false,
    }, // 活动的状态

    defaultStartTime: {
        type: String,
        required: true,
    }, // 默认的打卡时间几点到几点

    defaultStartDate: {
        type: Date,
        required: true,
    }, // 默认的参加活动的时间
    dateStatus: {
        type: Number,
        default: 7
    },  //默认7天
    timeStatus:{
        type: Number,
        default: 30 
    },  //  默认30分钟
    createdAt: {
        type: Date,
        default: Date.now
    }, // 添加活动的时间
    hasDeleted: {
        type: Boolean,
        default: false,
    }   //是否删除本条数据

});


module.exports = mongoose.model('Active', ActiveSchema);