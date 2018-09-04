const Gambler = require('./gambler.model');

function update(req, res, next) {
  var gamblerId = req.gambler.id;
  console.info("req.body.userInfo",req.body.userInfo)
  var userInfo = JSON.parse(req.body.userInfo);
  Gambler.findById(gamblerId)
    .then(gambler => {
      gambler.nickName = userInfo.nickName;
      gambler.avatarUrl = userInfo.avatarUrl;
      gambler.save()
        .then(savedGambler => {
            res.json(savedGambler)
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

module.exports = { update };