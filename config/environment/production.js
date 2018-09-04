// 开发环境配置 - development
// ==================================
module.exports = {
    // Port
    port: 10103,        // 小程序服务端口
  
    // MongoDB connection options
    mongo: {
      uri: 'mongodb://yinjiaxian:dby%23j1%23a@wxxcx-db/punchcard?authSource=admin'
    },
 
    // tenpay
    tenpay: {
      notify_url: 'https://pch.wofangyou.cn/api/orders/pay',
      refund_url: 'https://pch.wofangyou.cn/api/orders/refund'
    },

    // Mongoose debug option
    mongooseDebug: true,

    //消息链接
    messageUrl:{
      url : 'http://m.wofangyou.cn'
    },
  
    // Seed
    seed: true
};
  