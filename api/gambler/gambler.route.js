const express = require('express');
const authCtrl = require('../auth/auth.controller');
const gamblerCtrl = require('./gambler.controller');

const router = express.Router();

router.route('/updateMyInfo')
  /** PUT /api/gamblers/updateMyInfo - 更新玩家信息 */
  .put(authCtrl.isAuthenticated(), gamblerCtrl.update);


module.exports = router;