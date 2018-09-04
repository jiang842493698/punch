const tenpay = require('tenpay');

const config = require('./environment');
const tenpayConfig = {
  appid: config.miniprogram.appid,
  mchid: config.tenpay.mchid,
  partnerKey: config.tenpay.partnerKey,
  pfx: require('fs').readFileSync(`${config.root}/config/apiclient_cert.p12`),
  notify_url: config.tenpay.notify_url,
  refund_url: config.tenpay.refund_url
};


const api = new tenpay(tenpayConfig);

module.exports = { api };