//backend/routers/TrackingRoutes.js

const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/TrackingController');

router.get('/:harvestID', trackingController.getTrackingByHarvest);
router.post('/', trackingController.addTracking);

module.exports = router;
