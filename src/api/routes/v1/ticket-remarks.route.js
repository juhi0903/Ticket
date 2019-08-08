const express = require('express');
const controller = require('../../controllers/ticket-remarks.controller');
const validate = require('express-validation');
const validation = require('../../validations/ticket.validation');
const router = express.Router();

router.get('/review',controller.getReviewTicket);
router.get('/:ticketId?', controller.getRemarks);
router.post('/',controller.post)
router.post('/updatereview',controller.updateReview);
router.post('/approveTicket/:ticketId?',controller.approveTicket)


module.exports = router;