const async = require('async');
const httpStatus = require('http-status');
const tenpayAPI = require('../../config/tenpay').api;

const Order = require('./order.model');
const APIError = require('../helpers/APIError');

function unifiedOrder(req, res, next) {
  async.auto({
    createOrder: function (callback) {
      var order = new Order({
        gambler: req.gambler._id,
        body: req.body.body,
        totalFee: req.body.totalFee
      });
      order.save()
        .then(savedOrder => callback(null, savedOrder))
        .catch(e => callback(e));
    },
    unifiedOrder: ['createOrder', function (results, callback) {
      const order = results.createOrder;
      const orderData = {
        out_trade_no: order._id.toString(),
        body: order.body,
        total_fee: order.totalFee,
        openid: req.gambler.openId
      };
      tenpayAPI.unifiedOrder(orderData).then(rs => {
        let result = tenpayAPI.getPayParamsByPrepay({
          prepay_id: rs.prepay_id
        });
        result.orderId = order._id.toString();
        callback(null, result);
      }).catch(err => callback(err));
    }]
  }, function (err, results) {
    if (err) {
      next(err);
    } else {
      return res.json(results.unifiedOrder);
    }
  });
}

function checkUnifiedOrder(req, res, next) {
  let info = req.weixin;
  res.reply();
}

function refundOrder(req, res, next) {
  const orderId = req.params.orderId;
  async.auto({
    getOriginalOrder: function (callback) {
      Order.findById(orderId)
        .exec()
        .then(order => {
          if (order) {
            callback(null, order);
          } else {
            var err = new APIError('order is not existed.', httpStatus.NOT_FOUND);
            callback(err);
          }
        })
        .catch(e => callback(e));
    },
    createRefundOrder: function (callback) {
      var order = new Order({
        gambler: req.gambler._id,
        refundFee: req.body.refundFee
      });
      order.save()
        .then(savedOrder => callback(null, savedOrder))
        .catch(e => callback(e));
    },
    refundOrder: ['getOriginalOrder', 'createRefundOrder', function (results, callback) {
      const originalOrder = results.getOriginalOrder;
      const refundOrder = results.createRefundOrder;
      const refundData = {
        out_trade_no: originalOrder._id.toString(),
        out_refund_no: refundOrder._id.toString(),
        total_fee: originalOrder.totalFee,
        refund_fee: refundOrder.refundFee
      };
      tenpayAPI.refund(refundData).then(rs => {
        callback(null, rs);
      }).catch(err => callback(err));
    }]
  }, function (err, results) {
    if (err) {
      next(err);
    } else {
      return res.json(results.createRefundOrder);
    }
  });
}

function checkRefundOrder(req, res, next) {
  let info = req.weixin;
  res.reply();
}

module.exports = {
  unifiedOrder,
  checkUnifiedOrder,
  refundOrder,
  checkRefundOrder
};