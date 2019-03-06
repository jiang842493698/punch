// 开发环境配置 - development
// ==================================
module.exports = {
    // Port
    port: 10103,        // 小程序服务端口
  
    // MongoDB connection options
    mongo: {
      uri: 'mongodb:'
    },
 
    // tenpay
    tenpay: {
      notify_url: '',
      refund_url: ''
    },

    // Mongoose debug option
    mongooseDebug: true,

    //消息链接
    messageUrl:{
      url : ''
    },
  
    // Seed
    seed: true
};
  