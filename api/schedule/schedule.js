const schedule = require('node-schedule');
const punch = require("../punch/punch.model");
const async = require("async")
const moment = require('moment');

module.exports = function schedules(){
    function scheduleCronstyle(){
        let currentTime = moment().endOf("day").toDate()
        
        let rule = new schedule.RecurrenceRule();
        
        rule.hour = 7;
        rule.second = 1;
        rule.minute = 1;
        schedule.scheduleJob(rule, function(){
            punch.find({
                endDate: currentTime
            })
            .then(getPunchAll => {
                
                async.times(getPunchAll.length, function(punch, next){
                    getPunchAll[punch].isPunching = false
                    getPunchAll[punch].save()
                        .then(savedPunch => next(null, savedPunch))
                        .catch(err => next(err));
                }, function(err, punchInfos){
                    if(err){
                        console.info(err)
                    }
                })
            })
        }); 

    }
    scheduleCronstyle()
}



