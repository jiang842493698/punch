const express = require('express');
const wechatAuthCtrl = require('./wechat');

const router = express.Router();

router.route('/wechat')
  /** GET /api/auth/wechat 
   * 微信小程序用户认证，提供code，获取得到openid，
   * 若openid不存在，则创建用户，
   * 最后返回token 
   * */
  .get(wechatAuthCtrl.wechatAuthenticate);

module.exports = router;
