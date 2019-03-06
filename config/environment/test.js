// 开发环境配置 - development
// ==================================
module.exports = {
    // Port
    port: 10103,        // 小程序服务端口
  
    // MongoDB connection options
    mongo: {
      uri: ''
    },
  
    // Mongoose debug option
    mongooseDebug: true,

    // tenpay
    tenpay: {
      notify_url: '',
      refund_url: ''
    },

    //消息链接
    messageUrl:{
      url : ''
    },
  
    day: 0,

    // Seed
    seed: true
};
  