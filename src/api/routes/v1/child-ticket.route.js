const express = require('express');
const controller = require('../../controllers/child-ticket.controller');
const validate = require('express-validation');

const validation = require('../../validations/user.validation');

const router = express.Router();

router.get('/:ticketId?', controller.getChildTicket);

router.post('/', controller.postChildTicket);

module.exports = router;