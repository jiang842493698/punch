const express = require('express');
const authCtrl = require('../auth/auth.controller');
const punchRecordCtrl = require('./punchrecord.controller');

const router = express.Router();

router.route('/savePunch')
  .post(authCtrl.isAuthenticated(), punchRecordCtrl.savePunch)

module.exports = router;