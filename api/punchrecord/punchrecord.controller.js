const moment = require('moment');
const PunchRecord = require('./punchrecord.model')
const config = require('../../config/environment')

//判断今天是否有添加过打卡信息
function savePunch(req, res, next) {
  
  let punchDay = req.body.dateIndex
  var gambler = req.gambler;
  if(config.env=="production"){
    let punchDate = moment().startOf("day").toDate()
  // let currentTime = moment().valueOf()
  // let punchStartTime = moment().startOf("day").add(6, "hour").add(28, "minute").valueOf()
  // let punchEndTime = moment().startOf("day").add(7, "hour").add(1, "minute").valueOf()
  // if (currentTime > punchStartTime && currentTime < punchEndTime) {
    PunchRecord.find({
      punchDate,
      punch: req.body.punch,
      punchDay,
      gambler:gambler._id
    })
      .then(punchRecords => {
        console.info("punchRecord",punchRecords)
        // if (punchRecord.length > 0) {
        //   return res.json({ punchRecord })
        // } else {
          let punchRecord = new PunchRecord({
            punch: req.body.punch,
            punchDate,
            punchDay,
            gambler:gambler._id
          })
          punchRecord.save()
            .then(savePunchRecord => {
              return res.json({ punchRecord: savePunchRecord })
            })
            .catch(err => next(err))
        // }
      })
      .catch(err => next(err))
  // } else {
  //   return res.json({ err: "不在打卡的时间段" })
  // }
  }else{
    let punchDate = moment().startOf("day").add(config.day,"day").toDate()
    // let currentTime = moment().valueOf()
    // let punchStartTime = moment().startOf("day").add(6, "hour").add(28, "minute").valueOf()
    // let punchEndTime = moment().startOf("day").add(7, "hour").add(1, "minute").valueOf()
    // if (currentTime > punchStartTime && currentTime < punchEndTime) {
      PunchRecord.find({
        punchDate,
        punch: req.body.punch,
        punchDay,
        gambler:gambler._id
      })
        .then(punchRecords => {
          console.info("punchRecord",punchRecords)
          // if (punchRecord.length > 0) {
          //   return res.json({ punchRecord })
          // } else {
            let punchRecord = new PunchRecord({
              punch: req.body.punch,
              punchDate,
              punchDay,
              gambler:gambler._id
            })
            punchRecord.save()
              .then(savePunchRecord => {
                return res.json({ punchRecord: savePunchRecord })
              })
              .catch(err => next(err))
          // }
        })
        .catch(err => next(err))
    // } else {
    //   return res.json({ err: "不在打卡的时间段" })
    // }
  }

  
}

module.exports = {
  savePunch
};