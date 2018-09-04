const express = require('express');
const authCtrl = require('../auth/auth.controller');
const orderCtrl = require('./order.controller');
const tenpayAPI = require('../../config/tenpay').api;

const router = express.Router();

router.route('/')
  /** POST /api/orders - 下单 */
  .post(authCtrl.isAuthenticated(), orderCtrl.unifiedOrder);

router.route('/pay')
  .post(tenpayAPI.middlewareForExpress('pay'), orderCtrl.checkUnifiedOrder);

router.route('/:orderId/refund')
  /** POST /api/orders/:orderId/refund - 退款 */
  .post(authCtrl.isAuthenticated(), orderCtrl.refundOrder);

router.route('/refund')
  .post(tenpayAPI.middlewareForExpress('refund'), orderCtrl.checkRefundOrder);

module.exports = router;