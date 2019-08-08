const express = require('express');
const controller = require('../../controllers/stage.controller');
const validate = require('express-validation');


const router = express.Router();

router.get('/', controller.getStages);

router.post('/subStage', controller.getSubStages);

router.post('/', controller.saveStage);

module.exports = router;