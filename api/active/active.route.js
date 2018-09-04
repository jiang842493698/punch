const express = require('express');
const authCtrl = require('../auth/auth.controller');
const activeCtrl = require('./active.controller');

const router = express.Router();

/**新增活动 */
router.route('/')
    .post(authCtrl.isAuthenticated(), activeCtrl.savedActive)
    
router.route('/')
    .get(authCtrl.isAuthenticated(), activeCtrl.getActiveLoad)
    
router.route('/:activeId/getActiveById')
    .get(authCtrl.isAuthenticated(), activeCtrl.getActiveById)

/**修改活动状态（开始或者结束）*/
router.route('/:activeId/updateActiveByStatus')
    .put(authCtrl.isAuthenticated(), activeCtrl.updateActiveByStatus) 

/**修改活动内容*/
router.route('/:activeId/updateActive')
    .put(authCtrl.isAuthenticated(), activeCtrl.updateActive)

    /**删除当前活动*/
router.route('/:activeId/deleteActive')
    .put(authCtrl.isAuthenticated(), activeCtrl.deleteActive)          

    /** 修改Active状态，生成一条新的Punch记录 */
router.route('/:activeId/updateActiveAndInsertPunch')
    .put(authCtrl.isAuthenticated(), activeCtrl.updateActiveByPunch)     

router.param('activeId', activeCtrl.load);

module.exports = router;