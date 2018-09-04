const Active = require('./active.model')
let Punch = require('../../api/punch/punch.model')
const PunchRecord = require('../../api/punchrecord/punchrecord.model')
const Reserve = require('../../api/reserve/reserve.model')
const async = require('async');
let moment = require('moment')
const config = require('../../config/environment')

var load = function (req, res, next, id) {
  Active.findById(id)
    .exec()
    .then((active) => {
      req.active = active;
      return next();
    })
    .catch(e => next(e));
}

var savedActive = function (req, res, next) {
  const gambler = req.gambler;
  let active = new Active({
    gambler,
    name: req.body.name,
    status: true,
    defaultStartTime: req.body.startTime,
    defaultStartDate: moment(req.body.startDate).toDate()
  })
  active.save()
    .then(savedActive => {
      let punch = new Punch({
        gambler,
        active: savedActive._id,
        startTime: req.body.startTime,
        endTime: moment(req.body.startDate + " " + req.body.startTime).valueOf()>moment(req.body.startDate + " " + "23:30").valueOf() ? "23:59" : moment(req.body.startDate + " " + req.body.startTime).add(30,"minute").format("HH:mm"),
        isPunching: true,
        startDate: moment(req.body.startDate).startOf().toDate(),
        endDate: moment(req.body.startDate).add(6, "day").toDate()
      })
      punch.save()
        .then(savePunch => {
          return res.json({ active: savedActive, punch: savePunch })
        })
    })
    .catch(err => next(err))
}

/**打卡完成修改其状态 活动的结束和进行*/
var updateActiveByStatus = function (req, res, next) {
  const gambler = req.gambler;
  const active = req.active;
  if(config.env == "production"){
    Active.findOne({
      gambler: gambler._id,
      _id: active._id
    }).then(active => {
      if (!active) {
      } else {
        active.status = req.body.status
        active.defaultStartDate = req.body.startDate;
        active.save()
          .then(updateActive => {
            Punch.findOne({
              active:updateActive._id,
            }).then(punch => {
              punch.isPunching = false;
              punch.save()
              .then(savePunch=>{
                return res.json({ active: updateActive, punch:savePunch })
              })
              .catch(e => next(e))
             
            })
          })
          .catch(e => next(e))
      }
    })
  }else{
    Active.findOne({
      gambler: gambler._id,
      _id: active._id
    }).then(active => {
      if (!active) {
      } else {
        active.status = req.body.status
        active.defaultStartDate = req.body.startDate;
        active.save()
          .then(updateActive => {
            Punch.findOne({
              active:updateActive._id,
            }).then(punch => {
              punch.isPunching = false;
              punch.save()
              .then(savePunch=>{
                return res.json({ active: updateActive, punch:savePunch })
              })
              .catch(e => next(e))
             
            })
          })
          .catch(e => next(e))
      }
    })
  }
  
}

var updateActive = function(req,res,next){
  const gambler = req.gambler;
  const active = req.active;
  Active.findOne({
    gambler,
    _id: active._id
  }).then(active => {
    if (!active) {

    } else {
      active.gambler = gambler._id
      active.name = req.body.name;
      active.defaultStartTime = req.body.startTime;
      active.status= true;
      active.defaultStartDate = moment(req.body.startDate).toDate()
      active.save()
        .then(savedActive =>{
          let punch = new Punch({
            gambler,
            active: savedActive._id,
            startTime: req.body.startTime,
            endTime: moment(req.body.startDate + " " + req.body.startTime).valueOf()>moment(req.body.startDate + " " + "23:30").valueOf() ? "23:59" : moment(req.body.startDate + " " + req.body.startTime).format("HH:mm"),
            isPunching: true,
            startDate: moment(req.body.startDate).startOf().toDate(),
            endDate: moment(req.body.startDate).add(6, "day").toDate()
          })
          punch.save()
            .then(savePunch => {
              return res.json({ active: savedActive, punch: savePunch })
            })
        })
        .catch(e => next(e))
    }
  })
  .catch(err => next(err))
}

/**删除本条数据 修改hasDeleted为true */
var deleteActive = function(req,res,next){
  const gambler = req.gambler;
  const active = req.active;
  Active.findOne({
    gambler: gambler._id,
    _id: active._id
  }).then(active => {
    if (!active) {

    } else {
      active.hasDeleted = true;
      active.save()
        .then(updateActive => res.json({ active: updateActive }))
        .catch(e => next(e))
    }
  })
  .catch(err => next(err))
}

let getActiveLoad = function (req, res, next) {
  const gambler = req.gambler;
  console.info(config.day)
  if(config.env == "production"){
    async.auto({
      /**获取活动信息 */
      getActive: function (callback) {
        Active.find({
          gambler,
          hasDeleted: false
        })
          .lean()
          .then(active => {
            callback(null, active)
          }).catch(err => callback(err))
      },

      /**查询打卡周期 */
      getPunchCycle : function(callback){
        Punch.find({
          gambler,
          isPunching: false,
        }).then(punchList => {
          
          return res.json({PunchCycle:punchList})
        })
        .catch(err => callback(err))
      }, 
  
      /**获取进行中的打卡信息 */
      getCard: ['getActive', function (result, callback) {
        let active = result.getActive
        let activeId = []
        
        for (let a of active) {
          activeId.push(a._id)
        }
        if(activeId.length == 0){
          callback(null, [])
        }else{
          Punch.find({
            gambler,
            active: {
              $in: activeId
            },
            isPunching: true
          })
            .lean()
            .then(punch => {
              callback(null, punch)
            }).catch(err => callback(err))
        }
      }],
     
  
      /**获取打卡记录 */
      getCardRecord: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punch.length == 0) {
          callback(null,[])
        } else {
          PunchRecord.find({
            gambler: gambler._id,
            punch: {
              $in: punchId
            }
          })
            .lean()
            .then(punchRecord => {
              callback(null, punchRecord)
  
            }).catch(err => callback(err))
        }
      }],
  
      /**获取预约信息 */
      getReserve: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punch.length == 0) {
          callback(null,[])
        } else {
          Reserve.find({
            gambler: gambler._id,
            punch: {
              $in: punchId
            }
          })
            .lean()
            .then(reserve => {
              callback(null, reserve)
            }).catch(err => callback(err))
        }
      }],
  
      /**获取当天的打卡记录 */
      getCardRecordTheDay: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punchId.length == 0) {
          callback(null,[])
        } else {
          let data = {
            punch: {
              $in: punchId
            },
            gambler: gambler._id,
            punchDate: {
              $gte: moment().startOf("day").toDate(),
              $lte: moment().endOf("day").toDate()
            }
          }
          PunchRecord.find(data)
            .lean()
            .then(punchRecord => {
              callback(null, punchRecord)
            }).catch(err => callback(err))
        }
      }],
  
      /**获取当天的预约记录 */
      getReserveTheDay: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punchId.length == 0) {
          callback(null,[])
        } else {
          Reserve.find({
            punch: {
              $in: punchId
            },
            gambler: gambler._id,
            createdAt: {
              $gte: moment().startOf("day").toDate(),
              $lte: moment().endOf("day").toDate()
            }
          })
            .lean()
            .then(reserve => {
              callback(null, reserve)
            }).catch(err => callback(err))
        }
      }],
    }, function (err, results) {
      if (err) {
      } else {
        let active = results.getActive;
        let punch = results.getCard;
        let punchRecord = results.getCardRecord
        let reserve = results.getReserve
        let punchRecordTheDay = results.getCardRecordTheDay
        let reserveTheDay = results.getReserveTheDay
        let getPunchCycle = results.getPunchCycle
        //  /**
        // * 将punchRecord,reserve,punchRecordTheDay,reserveTheDay放入punch中
        // */
        for (let p of punch) {
          // p.punchRecord = punchRecord.filter(pr => pr.punch.equals(p._id))
          // p.reserve = reserve.filter(rs => rs.punch.toString() == p._id.toString())
          // p.punchRecordTheDay = punchRecordTheDay.filter(pd => pd.punch.toString() == p._id.toString())
          // p.reserveTheDay = reserveTheDay.filter(rd => rd.punch.toString() == p._id.toString())
          p.startDateFormat = moment(p.startDate).format("YYYY-MM-DD")
          p.endDateFormat = moment(p.endDate).format("YYYY-MM-DD")
        }
        // for(let a of active){
        //   a.active = punch.filter(p => p.active.toString() == a._id.toString())
        // }
        /**将当前时间，打卡押金，打卡返还的押金返回到前端 */
        let punchInfoJson = {
          currentTime: moment().add(2,"day").toDate(),              //当前时间
          cardDeposit: punch.length * 7,               //打卡总押金数
          cardDepositRefund: punchRecord.length,        //押金返还数
        }
        let data = {
          active, punch, punchInfoJson,reserve,reserveTheDay,punchRecord,punchRecordTheDay,getPunchCycle
        }
        return res.json(data)
      }
    })
  }else{
    async.auto({
      /**获取活动信息 */
      getActive: function (callback) {
        Active.find({
          gambler,
          hasDeleted: false
        })
          .lean()
          .then(active => {
            callback(null, active)
          }).catch(err => callback(err))
      },
      
      /**查询打卡周期 */
      getPunchCycle : ["getActive",function(result, callback){
        let active = result.getActive
        let activeId = []
        for (let a of active) {
          activeId.push(a._id)
        }
        if(activeId.length == 0){
          callback(null, [])
        }else{
          Punch.find({
            gambler,
            active: {
              $in: activeId
            },
            isPunching: false
          })
            .lean()
            .then(punch => {
              callback(null, punch)
            }).catch(err => callback(err))
        }
        
      }], 
  
      /**获取进行中的打卡信息 */
      getCard: ['getActive', function (result, callback) {
        let active = result.getActive
        let activeId = []
        
        for (let a of active) {
          activeId.push(a._id)
        }
        if(activeId.length == 0){
          callback(null, [])
        }else{
          Punch.find({
            gambler,
            active: {
              $in: activeId
            },
            isPunching: true
          })
            .lean()
            .then(punch => {
              callback(null, punch)
            }).catch(err => callback(err))
        }
      }],
     
  
      /**获取打卡记录 */
      getCardRecord: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punch.length == 0) {
          callback(null,[])
        } else {
          PunchRecord.find({
            gambler: gambler._id,
            punch: {
              $in: punchId
            }
          })
            .lean()
            .then(punchRecord => {
              callback(null, punchRecord)
  
            }).catch(err => callback(err))
        }
      }],
  
      /**获取预约信息 */
      getReserve: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punch.length == 0) {
          callback(null,[])
        } else {
          Reserve.find({
            gambler: gambler._id,
            punch: {
              $in: punchId
            }
          })
            .lean()
            .then(reserve => {
              callback(null, reserve)
            }).catch(err => callback(err))
        }
      }],
  
      /**获取当天的打卡记录 */
      getCardRecordTheDay: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punchId.length == 0) {
          callback(null,[])
        } else {
          let data = {
            punch: {
              $in: punchId
            },
            gambler: gambler._id,
            punchDate: {
              $gte: moment().startOf("day").add(config.day,"day").toDate(),
              $lte: moment().endOf("day").add(config.day,"day").toDate()
            }
          }
          PunchRecord.find(data)
            .lean()
            .then(punchRecord => {
              callback(null, punchRecord)
            }).catch(err => callback(err))
        }
      }],
  
      /**获取当天的预约记录 */
      getReserveTheDay: ['getCard', function (result, callback) {
        let punch = result.getCard
        let punchId = []
        for (let p of punch) {
          punchId.push(p._id)
        }
        if (punchId.length == 0) {
          callback(null,[])
        } else {
          Reserve.find({
            punch: {
              $in: punchId
            },
            gambler: gambler._id,
            createdAt: {
              $gte: moment().startOf("day").add(config.day,"day").toDate(),
              $lte: moment().endOf("day").add(config.day,"day").toDate()
            }
          })
            .lean()
            .then(reserve => {
              callback(null, reserve)
            }).catch(err => callback(err))
        }
      }],
    }, function (err, results) {
      if (err) {
      } else {
        let active = results.getActive;
        let punch = results.getCard;
        let punchRecord = results.getCardRecord
        let reserve = results.getReserve
        let punchRecordTheDay = results.getCardRecordTheDay
        let reserveTheDay = results.getReserveTheDay
        let getPunchCycle = results.getPunchCycle
        //  /**
        // * 将punchRecord,reserve,punchRecordTheDay,reserveTheDay放入punch中
        // */
        for (let p of punch) {
          // p.punchRecord = punchRecord.filter(pr => pr.punch.equals(p._id))
          // p.reserve = reserve.filter(rs => rs.punch.toString() == p._id.toString())
          // p.punchRecordTheDay = punchRecordTheDay.filter(pd => pd.punch.toString() == p._id.toString())
          // p.reserveTheDay = reserveTheDay.filter(rd => rd.punch.toString() == p._id.toString())
          p.startDateFormat = moment(p.startDate).format("YYYY-MM-DD")
          p.endDateFormat = moment(p.endDate).format("YYYY-MM-DD")
        }
        // for(let a of active){
        //   a.active = punch.filter(p => p.active.toString() == a._id.toString())
        // }
        /**将当前时间，打卡押金，打卡返还的押金返回到前端 */
        console.info(moment().add(config.day,"day").toDate())
        let punchInfoJson = {
          currentTime: moment().add(config.day,"day").toDate(),              //当前时间
          cardDeposit: punch.length * 7,               //打卡总押金数
          cardDepositRefund: punchRecord.length,        //押金返还数
        }
        let data = {
          active, punch, punchInfoJson,reserve,reserveTheDay,punchRecord,punchRecordTheDay,getPunchCycle
        }
        return res.json(data)
      }
    })
  }
  
}

let getActiveById = function(req, res, next){
  const active = req.active;
  Active.findOne({
    _id: active._id,
    hasDeleted: false
  }).then(active => {
    if (!active) {
      return res.json({err:""})
    } else {
      return res.json({active})
    }
  })
  .catch(err => next(err))

}

/**修改活动状态并且添加punch数据 */
let updateActiveByPunch = function(req, res, next){
  const gambler = req.gambler;
  const active = req.active;
  Active.findOne({
    _id: active._id
  }).then(active=>{
    console.info(active)
    if(!active){
      next(err)
    }else{
      active.status = true
      active.save()
      .then(saveActive =>{
        console.info("saveActive",saveActive)
        let currentTime = moment().format("YYYY-MM-DD")
        let punch = new Punch({
          gambler:gambler._id,
          // order: req.body.order,
          active: saveActive._id,
          startTime:  saveActive.defaultStartTime,
          endTime: moment(currentTime+" "+saveActive.defaultStartTime).add(30,"minute").format("HH:mm"),
          startDate: saveActive.defaultStartDate,
          endDate: moment(saveActive.defaultStartDate).add(saveActive.dateStatus,"day").toDate()
        })
        punch.save()
        .then(savePunch => {
          console.info("savePunch",savePunch)
          return res.json({ active: saveActive, punch: savePunch })
        })
        .catch(err=>next(err))
      })
      .catch(err=>next(err))
    }
  })
  .catch(err=>next(err))
}

module.exports = {
  load,
  savedActive,
  updateActiveByStatus,
  getActiveLoad,
  updateActive,
  deleteActive,
  getActiveById,
  updateActiveByPunch
}