// 开发环境配置 - development
// ==================================
module.exports = {
    // Port
    port: 9093,        // 小程序服务端口
  
    // MongoDB connection options
    mongo: {
      uri: '',
    },
    
    // Mongoose debug option
    mongooseDebug: true,

    //消息链接
    messageUrl:{
      url : ''
    },
    
    day: 1,

    // Seed
    seed: true
};
  