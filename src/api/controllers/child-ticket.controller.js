const httpStatus = require('http-status');
const responseService = require('../services/response.service');
const logger = require('../../api/utils/logger');
const chalk = require('chalk');
const {executeQuery} = require('../repository/index');
const url = require('url');
const sgMail = require('@sendgrid/mail');
const {SELECT_CHILD_TICKET, INSERT_INTEGRATION_SUB_TICKET, INSERT_NON_INTEGRATION_SUB_TICKET, INSERT_NON_TECHNICAL_SUB_TICKET , SELECT_PARENT_TICKET_COUNT, INSERT_REMARKS} = require('../repository/mysql/queries')

exports.getChildTicket =  async(req,res,next) => {
    try {
        var ticketId = url.parse(req.url,true).query['ticketId']; 
        const query = SELECT_CHILD_TICKET(ticketId);
         executeQuery(query).then(data => {
           res.send(data)
         });
      } catch (e) {
        next(e);
      }
};

exports.postChildTicket = async(req,res,next) => {
      let reviewer ;
      // const { title } = req.body;
      console.log(req.body.problemType);
      if(req.body.problemType=='FINC')
        reviewer = 'rathindra@globocom.info';
      if(req.body.problemType=='MKTG' || req.body.problemType=='MEDI' ||req.body.problemType=='CONT' || req.body.problemType=='ADVR' || req.body.problemType=='HR')
       reviewer = 'rv@globocom.info';
      if(req.body.problemType=='TECH' || req.body.problemType=='APPL')
       reviewer = 'pankaj@globocom.info';
      if(req.body.problemType=='ANLY')
       reviewer = 'saji@globocom.info';
    try {
        let query = SELECT_PARENT_TICKET_COUNT(req.body.parentTicket);
        executeQuery(query).then(data => {
         const ticketId = req.body.parentTicket + '_Sub_' + data[0].id ;
         console.log(ticketId);
          if(req.body.problemType==='TECH' && req.body.subProblem==='Integration'){
           query = INSERT_INTEGRATION_SUB_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.platform,req.body.country,req.body.operator,req.body.biller,req.body.parentTicket,req.body.subProblem,req.body.supervisor,reviewer);
          }
          else if(req.body.problemType==='TECH' && req.body.subProblem!='Integration'){
           query = INSERT_NON_INTEGRATION_SUB_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.platform,req.body.parentTicket,req.body.subProblem,req.body.supervisor,reviewer);
          }
          else{
            query = INSERT_NON_TECHNICAL_SUB_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.parentTicket,req.body.supervisor,reviewer)
          }
          executeQuery(query).then(data => {
            const msg = {
              to: req.body.assignTo,
              from: req.headers['authorization'],
              subject: req.body.title,
              text: req.body.details,
              cc : [req.body.supervisor,reviewer],
              html: `<strong>Hi,</strong>
                      <p> Sub Ticket <strong>${ticketId}</strong> has been raised to you, as part of ticket ${req.body.parentTicket}</p>
                      <p><strong>Description : </strong> ${req.body.details} </p>
                      <p> Please <a href="http://43.231.124.147:8080/ticket/ticketdetails/" +${ticketId}">Click</a> the link to view more details. </p>
    
                       <p> Regards,</p>
                       <p>${req.headers['authorization']} </p>
                      `,
            };
            sgMail.send(msg).then(result => {
              logger.info(chalk.green("Mail Sent Successfully"));
            }, err => {
              logger.info(chalk.red(err));
            });
            let remarks = `Sub Ticket ${ticketId} has been created`;
            query = INSERT_REMARKS(req.body.parentTicket,remarks,req.headers['authorization'],'New Ticket Added');
            executeQuery(query).then(data => {

            });
            res.send(data);
          }); 
        });
    } catch (e) {
      next(e);
    }
};
