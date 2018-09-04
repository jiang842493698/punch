// 开发环境配置 - development
// ==================================
module.exports = {
    // Port
    port: 10103,        // 小程序服务端口
  
    // MongoDB connection options
    mongo: {
      uri: 'mongodb://test-yjx:tt%23f%23abc@wxxcx-db/punchcard-test?authSource=admin'
    },
  
    // Mongoose debug option
    mongooseDebug: true,

    // tenpay
    tenpay: {
      notify_url: 'https://pcht.wofangyou.cn/api/orders/pay',
      refund_url: 'https://pcht.wofangyou.cn/api/orders/refund'
    },

    //消息链接
    messageUrl:{
      url : 'http://mt.wofangyou.cn'
    },
  
    day: 0,

    // Seed
    seed: true
};
  