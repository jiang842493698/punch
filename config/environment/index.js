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

  jwtSecret: '8F69529FC6917F1B054BF4EC040473EE07C7FA008FC56305CF569712A66E6348',

  // 小程序（7天打卡）
  miniprogram: {
    appid: 'wx07a151f187e775d7',
    secret: 'cb6fd049ccde78e62cdf4023f21faa39'
  },

  // 微信支付
  tenpay: {
    mchid: '1457343002',
    partnerKey: 'dkfjeisl12k3l4lf9zlq901klf0937dr'
  },

  //消息模板Id
  messageTemplateId:{
    templateId:'tU-STvzQap1WEbntZzOGHg7g7XwIKjrjJiSIQLXcBgw'
  }
};

// 根据NODE_ENV的值，扩展出完整的配置信息
// ==================================
module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {}
);