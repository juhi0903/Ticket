const express = require('express');
const controller = require('../../controllers/ticket.controller');
const validate = require('express-validation');
const validation = require('../../validations/ticket.validation');

const router = express.Router();

router.post('/', controller.saveTicket);
router.get('/',  controller.getAllTickets);
router.get('/personal',  controller.myTickets);
router.get('/pending',  controller.pending);
router.get('/complete',  controller.completed);
router.put('/updatestatus',  controller.updateStatus);
router.put('/updatepriority',  controller.updatePriority);
router.put('/updateassignto',  controller.updateAssignTo);
router.get('/ticket',  controller.tickets);
router.get('/graphdata',  controller.graphData);
router.get('/ticketdetails/:ticketId?',  controller.getTicketDetails); 
router.post('/statusorperson',  controller.getTicketByStatusOrAssignTo); 
router.get('/notUpdatedTicket/:date?',controller.getNotUpdatedTicket);
router.get('/raised',controller.getTicketsRaisedByMe);
router.get('/progress',controller.getPendingTicketsRaisedByMe);
router.get('/closed',controller.getClosedTicketsRaisedByMe);
router.get('/issue/notUpdatedTicket/:date?',controller.getIssueNotUpdatedTicket);
router.get('/country',controller.getCountry);
router.get('/status/:status?',controller.getTicketByStatus);
router.post('/ticketv2',controller.getTicketV2);


// router.post('/addRemarks', controller.addRemarks);


module.exports = router;
