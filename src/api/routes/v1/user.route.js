const express = require('express');
const controller = require('../../controllers/user.controller');
const validate = require('express-validation');

const validation = require('../../validations/user.validation');
let upload = require('../../../config/multer.config.js');


const router = express.Router();

router.get('/allusers', controller.allusers);

router.get('/auth/:token?', controller.auth);

router.get('/', controller.verify);
router.post('/upload',upload.single("file"), controller.upload);
router.post('/download', controller.downloadReport);
router.get('/emailId', controller.emailId);

module.exports = router;
