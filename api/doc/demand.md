 
1. 需要的接口
  active
    get   /api/active 查询活动首页信息*
    post  /api/active 新增活动信息*
    put   /api/active/:activeId/updateActive 修改活动的状态（为false说明本轮活动结束）下一次为true是说明用户继续参加了此活动的打卡会在punch表中生成一条新纪录
  punch
    post  /api/punches/createPunch 参加打卡行动信息*
    put   /api/punches/:punchId/updatePunch 修改打卡行动的状态
  punchRecord
    post  /api/punchRecords/savePunch 添加打卡记录*
  reserve
    post  /api/reserve/saveReserve    添加预约记录*  


