const async = require('async');
const request = require('request-promise');

const Gambler = require('../../gambler/gambler.model');
const signToken = require('../auth.controller').signToken;
const config = require("../../../config/environment")

function wechatAuthenticate(req, res, next) {
  var code = req.headers['x-wx-code'];
  async.auto({
    getOpenData: function(callback) {
      const options = {
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          appid: config.miniprogram.appid,
          secret: config.miniprogram.secret,
          js_code: code,
          grant_type: 'authorization_code'
        },
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      request(options)
        .then(openData => {
          console.info(openData)
          callback(null, openData);
        })
        .catch(e => {
          callback(e);
        });
    },
    getGambler: ['getOpenData', function(results, callback) {
      const openId = results.getOpenData.openid;
      const sessionKey = results.getOpenData.session_key;

      Gambler.findOne({
        openId: openId
      }).then(gambler => {
        console.info(gambler)
        if (gambler){
          gambler.sessionKey = sessionKey;
          gambler.save()
            .then(savedGambler => {
                callback(null, savedGambler)
            })
            .catch(e => callback(e));
        } else {
          const newGambler = new Gambler({
            openId: openId,
            sessionKey: sessionKey
          });
          newGambler.save()
            .then(savedGambler => {
                callback(null, savedGambler)
            })
            .catch(e => callback(e));
        }
      }).catch(e => callback(e));
    }]
  }, function(err, results) {
    if (err) {
      next(err);
    } else {
      var gambler = results.getGambler;
      var token = signToken(gambler._id);
      return res.json({ token });
    }
  });
}

module.exports = { wechatAuthenticate };
