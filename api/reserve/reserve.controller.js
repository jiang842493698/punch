const moment = require('moment');
const request = require('request-promise');
const Reserve = require('./reserve.model')
const config = require('../../config/environment')

//新增明天的预约信息
function saveReserve(req, res, next) {
  let tomorrowDate
  if (config.env != 'production') {
    if(req.body.dateIndex < 0){
      tomorrowDate = moment(req.body.startDate).startOf("day").toDate();
    }else{
      tomorrowDate = moment().startOf("day").add(config.day + 1, "day").toDate();
    }
  } else {
    if(req.body.dateIndex < 0){
      tomorrowDate = moment(req.body.startDate).startOf("day").toDate();
    }else{
      tomorrowDate = moment().startOf("day").add(1, "day").toDate();
    }
    
  }
  const remindDate = moment().startOf("day").add(1, "day").add(6, "hour").add(30, "Minute").toDate();
  // const remindDate = moment().startOf("day").add(11,"Seconds").toDate();
  const gambler = req.gambler;
  const punchId = req.body.punchId;
  const dateIndex = req.body.dateIndex;
  const order = req.body.order;
  const formId = req.body.formId;
  // const increment = req.body.increment; //版本号
  Reserve.findOne({
    punch: punchId,
    gambler: gambler._id,
    reserveDate: tomorrowDate,
    // __v: increment
  })
    .then(reserve => {
      if (reserve) {
        return res.json({ reserve })
      } else {
        let reserve = new Reserve({
          punch: punchId,
          gambler: gambler._id,
          reserveDate: tomorrowDate,
          reserveAt: remindDate,
          reserveDay: dateIndex + 1,
          formId,
          createdAt: moment().add(config.day,"day").toDate()
        })
        reserve.save()
          .then(savedReserve => {
            if (savedReserve) {

              const messagesData = {
                appId: config.miniprogram.appid,
                appSecret: config.miniprogram.secret,
                openId: gambler.openId,
                templateId: config.messageTemplateId.templateId,
                page: 'pages/punch/index',
                formId: req.body.formId,
                when: remindDate,
                data: {
                  "keyword1": {
                    "value": "7天打卡计划"
                  },
                  "keyword2": {
                    "value": "6:30:00~7:00:00",
                  },
                  "keyword3": {
                    "value": "" + (dateIndex + 1) + "/7"
                  },
                  "keyword4": {
                    "value": "坚持就是胜利"
                  },
                }
              }

              let options = {
                url: config.messageUrl.url + "/api/messages",
                method: "POST",
                body: messagesData,
                json: true
              }
              console.info("options", options)
              request(options)
                .then(message => {
                  if (message) {
                    console.info("message", message)
                    return res.json({ reserve: savedReserve })
                  }
                })
                .catch(err => next(err))
            }
          })
          .catch(err => next(err))
      }
    })
    .catch(err => next(err));
}

//查询当天的预约信息
function getReserve(req, res, next){
  const currentDate = moment().startOf("day").toDate()
  const gambler = req.gambler
  const punchId = req.body.punchId
  Reserve.findOne({
    punch: punchId,
    gambler: gambler._id,
    reserveDate: currentDate,
  })
  .then( reserve => res.json(reserve))
  .catch( err => next(err) )
}


module.exports = {
  saveReserve,
  getReserve
}