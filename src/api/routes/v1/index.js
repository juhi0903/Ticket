const express = require('express');
// import all the routes here
const userRoutes = require('./user.route');
const ticketRoutes = require('./ticket.route');
const remarksRoutes = require('./ticket-remarks.route');
const childTicketRoutes = require('./child-ticket.route');
const stageRoutes = require('./stage.route');
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send({ message: 'OK' }));

router.use('/user',userRoutes);
router.use('/ticket', ticketRoutes);
router.use('/remarks', remarksRoutes);
router.use('/stage', stageRoutes);
router.use('/childticket', childTicketRoutes);


module.exports = router;
