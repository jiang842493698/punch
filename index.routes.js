const express = require('express');
const authRoutes = require('./api/auth/auth.route');
const gamblerRoutes = require('./api/gambler/gambler.route');
const orderRoutes = require('./api/order/order.route');
const punchRoutes = require('./api/punch/punch.route');
const punchRecordRoutes = require('./api/punchrecord/punchrecord.route');
const reserveRoutes = require('./api/reserve/reserve.route');
const activeRoutes = require('./api/active/active.route')

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
    res.send('OK');
});

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /players
router.use('/gamblers', gamblerRoutes);

// mount order routes at /orders
router.use('/orders', orderRoutes);

// mount punch routes at /punches
router.use('/punches', punchRoutes);

router.use('/punchRecords', punchRecordRoutes);

router.use('/reserve', reserveRoutes);

router.use('/active', activeRoutes)

module.exports = router;