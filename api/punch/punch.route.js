const express = require('express');
const authCtrl = require('../auth/auth.controller');
const punchCtrl = require('./punch.controller');


const router = express.Router();

router.route('/getMyPunch')
  .get(authCtrl.isAuthenticated(), punchCtrl.getMyPunch);

router.route('/createPunch')
  .post(authCtrl.isAuthenticated(), punchCtrl.createPunch);

router.route('/getPunchCount')
  .get(punchCtrl.getPunchCount);
  
router.route('/updatePunchStart')
  .put(authCtrl.isAuthenticated(), punchCtrl.updatePunchStart);

module.exports = router;