const express = require('express');
const authCtrl = require('../auth/auth.controller');
const reserveCtrl = require('./reserve.controller');

const router = express.Router();

router.route('/saveReserve')
  .post(authCtrl.isAuthenticated(), reserveCtrl.saveReserve)

router.route('/getReserve')
  .get(authCtrl.isAuthenticated(),reserveCtrl.getReserve)

module.exports = router;

