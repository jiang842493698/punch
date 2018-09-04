const moment = require('moment');
const async = require('async');
const Punch = require('./punch.model');
const PunchRecord = require('../punchrecord/punchrecord.model')
const Reserve = require('../reserve/reserve.model')

const config = require('../../config/environment') 

function getMyPunch(req, res, next){
  if(config.env != 'production'){//不为正式环境的情况下需要模拟
    Punch.findOne({
      gambler: req.gambler._id,
      isPunching: true,
      }).then(punch => {
        if (punch) {  // 存在正在进行中的打卡
          async.parallel({
            getPunchRecord: function(callback){
              PunchRecord.find({ punch: punch._id })
                
                .then(punchRecords => {
                  callback(null,punchRecords)
                })
                .catch(err => callback(err));   
            },
            getReserve: function(callback){
              Reserve.find({
                punch: punch._id,
                gambler: req.gambler._id,
              })
              .then( reserve => {
                callback(null, reserve)
              })
              .catch( err => callback(err) )
            },
            getPunchCount:function(callback){
              Punch.count({
                gambler: req.gambler._id,
              })
                .then( punchCount => {
                  callback(null, punchCount)
                } )
                .catch( err => callback(err) )
            }
          },function(err,result){
            if(err){
              return next(err)
            }else{
              let dateJson = {
                currentTime: moment().add(config.day,"day").valueOf(),
              }
              const data = {
                punch,
                punchRecord: result.getPunchRecord,
                reserve: result.getReserve,
                punchCount: result.getPunchCount,
                dateJson,
                
              }
              return res.json(data)
            }
          })
        } else {
          let dateJson = {
            currentTime: moment().add(config.day,"day").valueOf(),
          }
          var result = {
            dateJson,
            punch: {
              startDate: moment().add(1,'day').startOf('day').format("YYYY-MM-DD"),
              endDate: moment().add(7,'day').endOf('day').format("YYYY-MM-DD"),
              isPunching: false
            },
            punchRecord: [],
            reserve: []
          };
          return res.json(result);
        }
      }).catch(err=> next(err));
  }else{
    Punch.findOne({
    gambler: req.gambler._id,
    isPunching: true,
    }).then(punch => {
      if (punch) {  // 存在正在进行中的打卡
        async.parallel({
          getPunchRecord: function(callback){
            PunchRecord.find({ punch: punch._id })
              
              .then(punchRecords => {
                callback(null,punchRecords)
              })
              .catch(err => callback(err));   
          },
          getReserve: function(callback){
            Reserve.find({
              punch: punch._id,
              gambler: req.gambler._id,
            })
            .then( reserve => {
              callback(null, reserve)
            })
            .catch( err => callback(err) )
          },
          getPunchCount:function(callback){
            Punch.count({
              gambler: req.gambler._id,
            }).then(punchCount => callback(null, punchCount))
              .catch(err => callback(err));
          }
        },function(err,result){
          if(err){
            return next(err)
          }else{
            let dateJson = {
              currentTime: moment().valueOf(),
            }
            const data = {
              punch,
              punchRecord: result.getPunchRecord,
              reserve: result.getReserve,
              punchCount: result.getPunchCount,
              dateJson
            }
            return res.json(data)
          }
        })
      } else {
        let dateJson = {
          currentTime: moment().valueOf(),
        }
        var result = {
          dateJson,
          punch: {
            startDate: moment().add(1,'day').startOf('day').format("YYYY-MM-DD"),
            endDate: moment().add(7,'day').endOf('day').format("YYYY-MM-DD"),
            isPunching: false
          },
          punchRecord: [],
          reserve: []
        };
        return res.json(result);
      }
    }).catch(err=> next(err));

  }

  
}


/**
 * 创建打卡信息
 * 二次验证：不可重复创建
 * 
 */

function createPunch(req, res, next){
  var gamblerId = req.gambler._id;
  let orderId = req.body.orderId
  
    //查询当前时间是否有打卡信息
    
    Punch.findOne({
      gambler: gamblerId,
      isPunching: true
    })
    .then(punch => {
      if(punch){
        return res.json({ punch: punch })
      }else{
        let punch = new Punch({
          gambler: gamblerId,
          startDate: moment().add(1,'day').startOf('day').toDate(),
          endDate: moment().add(7,'day').endOf('day').toDate(),
          order : orderId
        });
        punch.save()
        .then(savedPunch => res.json({ punch: savedPunch }))
        .catch(err => next(err))
      }
    })
    .catch(err => next(err))
}

function getPunchCount(req, res, next){
  Punch.count()
    .exec()
    .then(punchCount => res.json({ punchCount }))
    .catch(err => next(err));
}

function updatePunchStart(req, res ,next){
  var gamblerId = req.gambler.id;
  Punch.findOne({
    gambler: gamblerId,
    isPunching : true

  }).then(punch => {
    punch.isPunching = false
    punch.save()
      .then(updatePunch => {
          return res.json({punch:updatePunch})
      })
      .catch(err=>{
          return res.json({punch: false})
      })
  })
  .catch(err => {
    return res.json({punch:{
        startDate :  moment().add(1,'day').startOf('day').format("YYYY-MM-DD"),
        endDate: moment().add(7,'day').endOf('day').format("YYYY-MM-DD"),
        isPunching : false
    }, punchInfo:[]});
  });
}

module.exports = {
    getMyPunch,
    createPunch,
    getPunchCount,
    updatePunchStart
};
