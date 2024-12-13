//backend/routers/HarvestRoutes.js

const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/HarvestController');

router.get('/', harvestController.getAllHarvests);
router.post('/', harvestController.createHarvest);
router.put('/', harvestController.updateHarvest);
router.delete('/:id', harvestController.deleteHarvest);
router.get('/:id', harvestController.getHarvestById);

module.exports = router;