// 设置Node Environment
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const util = require('util');

// 在引用其他文件之前，优先引用config
const config = require('./config/environment');
const app = require('./config/express');

const debug = require('debug')('raffle-server:wxapp');

// 使用BlueBird作为默认的Promise实现
mongoose.Promise = require('bluebird');

// 连接MongoDB
const mongoUri = config.mongo.uri;
mongoose.connect(mongoUri, { 
  keepAlive: true
});
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// 打印Mongoose日志
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.listen(config.port, () => {
  console.info(`wxapp server started on port ${config.port} (${config.env})`);
});

module.exports = app;