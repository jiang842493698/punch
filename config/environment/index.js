const path = require('path');
const _ = require('lodash');

// 基础配置
// ==================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../..`),

  // Server Port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  jwtSecret: '',

  // 小程序（7天打卡）
  miniprogram: {
    appid: 'aaa',
    secret: 'aaa'
  },

  // 微信支付
  tenpay: {
    mchid: '',
    partnerKey: ''
  },

  //消息模板Id
  messageTemplateId:{
    templateId:''
  }
};

// 根据NODE_ENV的值，扩展出完整的配置信息
// ==================================
module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {}
);