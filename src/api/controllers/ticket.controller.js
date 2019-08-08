const httpStatus = require('http-status');
const responseService = require('../services/response.service');
const logger = require('../../api/utils/logger');
const chalk = require('chalk');
const url = require('url');
const {executeQuery} = require('../repository/index')
const dateTime = require('node-datetime');
const sgMail = require('@sendgrid/mail');
const scheduler = require('node-schedule');
var fs = require('fs')

const {INSERT_STATUS_STAGE_FILE_ATTACH,INSERT_STAGE_FILE_ATTACH,INSERT_NON_TECHNICAL_TICKET,UPDATE_PREVIOUS_REMARKS_STAGE , UPDATE_FILE_DETAILS, INSERT_PREVIOUS_REMARKS_STAGE , INSERT_PREVIOUS_REMARKS ,SELECT_TICKET_DETAILS_BY_ID , INSERT_STATUS_STAGE ,SELECT_ALL_PENDING_TICKETS, SELECT_MAX_ID, SELECT_TICKETS, SELECT_MY_TICKETS,
 SELECT_COMPLETED_TICKETS, SELECT_PENDING_TICKETS, UPDATE_STATUS, INSERT_STATUS, UPDATE_PRIORITY, UPDATE_ASSIGNTO , SELECT_ALL_TICKET_BY_STATUS, INSERT_INTEGRATION_TICKET, INSERT_NON_INTEGRATION_TICKET, INSERT_REMARKS ,  SELECT_CLOSED_TICKET_RAISED_BY_PERSON, SELECT_PENDING_TICKET_RAISED_BY_PERSON, 
 SELECT_ALL_RAISED_TICKET_BY_PERSON , SELECT_STATUS_COUNT_GROUP_BY ,SELECT_NOT_UPDATED_TICKETS_TO_SEND_MAIL,SELECT_ISSUED_NOT_UPDATED_TICKETS,SELECT_COUNTRY,STATUS_COUNT,SELECT_WORKING_TICKETS,SELECT_PENDING_HOLD_TICKETS,SELECT_ALL_TICKET_V2} = require('../repository/mysql/queries');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.saveTicket = async(req, res, next) => {

  try {
    let reviewer ;
    if(req.body.problemType=='FINC')
    reviewer = 'rathindra@globocom.info';
       if(req.body.problemType=='MKTG' || req.body.problemType=='MEDI' ||req.body.problemType=='CONT' || req.body.problemType=='ADVR' || req.body.problemType=='HR')
       reviewer = 'rv@globocom.info';
       if(req.body.problemType=='TECH' || req.body.problemType=='APPL')
       reviewer = 'pankaj@globocom.info';
       if(req.body.problemType=='ANLY')
       reviewer = 'saji@globocom.info';
    let query = SELECT_MAX_ID();
    executeQuery(query).then(data => {
     const ticketId = 'Globo_' + data[0].id;
      if(req.body.problemType==='TECH' && req.body.subProblem==='Integration'){
       query = INSERT_INTEGRATION_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.platform,req.body.country,req.body.operator,req.body.biller,req.body.subProblem,req.body.supervisor,reviewer);
      }
      else if(req.body.problemType==='TECH' && req.body.subProblem!='Integration'){
       query = INSERT_NON_INTEGRATION_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.platform,req.body.subProblem,req.body.supervisor,req.body.country,reviewer);
      }
      else{
        query = INSERT_NON_TECHNICAL_TICKET(ticketId,req.headers['authorization'],req.body.assignTo,req.body.status,req.body.title,req.body.details,req.body.problemType,req.body.priorityLevel,req.body.supervisor,req.body.country,reviewer);
      }
      executeQuery(query).then(data => {
        if(req.body.hasOwnProperty('fileName')){
          query = UPDATE_FILE_DETAILS(req.body.fileName,req.body.filePath,ticketId);
          executeQuery(query).then(data => {
            const msg = {
              to: [req.body.assignTo],
              from: req.headers['authorization'],
              subject: req.body.title,
              text: req.body.details,
              cc : [req.body.supervisor,reviewer],
              attachments: [{   // file on disk as an attachment
                filename: req.body.fileName,
                // path: req.body.filePath // stream this file
                content: base64_encode(req.body.filePath),
              }],
              html: `<strong>Hi,</strong>
                      <p> New Ticket <strong>${ticketId}</strong> has been raised to you.</p>
                       <p><strong>Description : </strong> ${req.body.details} </p>
                       <p> Please <a href="http://43.231.124.147:8080/ticket/ticketdetails/" +${ticketId}>Click</a> the link to view more details. </p>
    
    
                       <p> Regards</p>
                      `,
            };
            // console.log(msg);
            sgMail.send(msg).then(result => {
              logger.info(chalk.green("Mail Sent Successfully"));
            }, err => {
              logger.info(chalk.red(err));
          });
         });
        }
        else{
          const msg = {
            to: [req.body.assignTo],
            from: req.headers['authorization'],
            subject: req.body.title,
            text: req.body.details,
            cc : [req.body.supervisor,reviewer],
            html: `<strong>Hi,</strong>
                    <p> New Ticket <strong>${ticketId}</strong> has been raised to you. </p>
                     <p><strong>Description : </strong> ${req.body.details} </p>
                     <p> Please <a href="http://43.231.124.147:8080/ticket/ticketdetails/" +${ticketId}>Click</a> the link to view more details. </p>
    
                     <p> Regards</p>
                    `,
          };
          // console.log(msg);
          sgMail.send(msg).then(result => {
            logger.info(chalk.green("Mail Sent Successfully"));
          }, err => {
            logger.info(chalk.red(err));
          });
        }
        
        
      }); 
      res.send(data);
    });
  } catch (e) {
    next(e);
  }
};

exports.getAllTickets = async(req, res, next) => {
    try {
      const query = SELECT_TICKETS();
       executeQuery(query).then(data => {res.send(data);
       });
    } catch (e) {
      next(e);
    }
  };

  exports.myTickets = async(req, res, next) => {
    try {
      var sess = req.session;
      console.log(sess);
      const query = SELECT_MY_TICKETS(req.headers['authorization']);
       executeQuery(query).then(data => {res.send(data)
       });
    } catch (e) {
      next(e);
    }
  };

  exports.pending = async(req, res, next) => {
    try {
      const query = SELECT_PENDING_TICKETS(req.headers['authorization']);
       executeQuery(query).then(data => {res.send(data)
       });
    } catch (e) {
      next(e);
    }
  };

  exports.completed = async(req, res, next) => {
    try {
      const query = SELECT_COMPLETED_TICKETS(req.headers['authorization']);
       executeQuery(query).then(data => {res.send(data)
       });
    } catch (e) {
      logger.info(chalk.red(e));
      next(e);
    }
  };

  exports.updateStatus = async(req, res, next) => {
    try {
      let status = req.body.status;
      let updateType = req.body.updateType;
      let query;
      // console.log(req.body);
        if(req.body.status!='Not Updated'){
        query = UPDATE_STATUS(req.body.status,req.body.remarks,req.headers['authorization'], req.body.ticketId) ;
        }
        else{
          query = SELECT_MAX_ID();
        }
        executeQuery(query).then(data => {res.send(data)
          if(updateType == 'status'){
            if(status ==='Integration'){
              if(req.body.hasOwnProperty('fileName')){
                query = INSERT_STATUS_STAGE_FILE_ATTACH(req.body.status,req.body.stage,req.body.subStage,req.body.ticketId,req.body.remarks,req.headers['authorization'],req.body.fileName,req.body.filePath);
              }
              else{
               query = INSERT_STATUS_STAGE(req.body.status,req.body.stage,req.body.subStage,req.body.ticketId,req.body.remarks,req.headers['authorization']);
              }
              executeQuery(query).then(data => {
              });
            }
            else{
              if(req.body.hasOwnProperty('fileName')){
                query = INSERT_STAGE_FILE_ATTACH(req.body.status,req.body.ticketId,req.body.remarks,req.headers['authorization'],req.body.fileName,req.body.filePath);
              }
              else{
               query = INSERT_STATUS(req.body.status,req.body.ticketId,req.body.remarks,req.headers['authorization']);
              }
              executeQuery(query).then(data => {
              });
            }
            if(status==='Closed'){
              const query = SELECT_TICKET_DETAILS_BY_ID(req.body.ticketId);
              executeQuery(query).then(data => {
                // console.log(data);
                const msg = {
                  to: data[0].raisedBy,
                  from: req.headers['authorization'],
                  subject: data[0].title, 
                  cc :  data[0].supervisor,           
                  html: `<strong>Hi,</strong>
                          <p>Ticket <strong>${req.body.ticketId}</strong> has been closed by ${req.headers['authorization']}. </p>
                           <p><strong>Remark : </strong> ${req.body.remarks} </p>
                           <p> Please <a href="http://43.231.124.147:8080/ticket">Click</a> the link to view more details. </p>
        
                           <p> Regards,</p>
                           <p>${req.headers['authorization']}</p>
                          `,
                };
                // console.log(msg);
                sgMail.send(msg).then(result => {
                  logger.info(chalk.green("Mail Sent Successfully"));
                }, err => {
                  logger.info(chalk.red(err));
                });
              });
            }
            if(req.body.hasOwnProperty('to')){
              const msg = {
                to: [req.body.to],
                from: req.headers['authorization'],
                subject: req.body.title,                
                html: `<strong>Hi,</strong>
                        <p>You are tagged in the remark of ticket <strong>${req.body.ticketId}</strong>.</p>
                         <p><strong>Remark : </strong> ${req.body.remarks} </p>
                         <p> Please <a href="http://43.231.124.147:8080/ticket">Click</a> the link to view more details. </p>
      
                         <p> Regards,</p>
                         <p>${req.headers['authorization']}</p>
                        `,
              };
              if(req.body.hasOwnProperty('cc')){
                msg.cc = [req.body.cc];
              }
              sgMail.send(msg).then(result => {
                logger.info(chalk.green("Mail Sent Successfully"));
              }, err => {
                logger.info(chalk.red(err));
              });
            }
           
        }
        else if(updateType=='remarks' && req.body.id=='0'){
          if(status ==='Integration'){
            const query = INSERT_PREVIOUS_REMARKS_STAGE(req.body.status,req.body.stage,req.body.subStage,req.body.ticketId,req.body.remarks,req.body.addedOn,req.headers['authorization']);
            executeQuery(query).then(data => {
            });
          }
          else{
            const query = INSERT_PREVIOUS_REMARKS(req.body.status,req.body.ticketId,req.body.remarks,req.body.addedOn,req.headers['authorization']);
            executeQuery(query).then(data => {
            });
          }
         }
         else if(updateType=='remarks' && req.body.id!='0'){
            const query = UPDATE_PREVIOUS_REMARKS_STAGE(req.body.remarks,req.body.id);
            executeQuery(query).then(data => {
          });
        }
      });
    } catch (e) {
      next(e);
    }
  };

  exports.updatePriority = async(req, res, next) => {
    try {
      const query = UPDATE_PRIORITY(req.body.priorityLevel,req.headers['authorization'],req.body.id)
             executeQuery(query).then(data => {res.send(data)
              const query = INSERT_REMARKS(req.body.ticketId,req.body.remarks,req.headers['authorization'],'Reprioritize');
              executeQuery(query).then(data => {
                // console.log(data);
              });
       });
    } catch (e) {
      next(e);
    }
  };

  exports.updateAssignTo = async(req, res, next) => {
    try {
      const query = UPDATE_ASSIGNTO(req.body.assignedTo,req.headers['authorization'],req.body.id,req.body.supervisor);
       executeQuery(query).then(data => {
        const query = INSERT_REMARKS(req.body.ticketId,req.body.remarks,req.headers['authorization'],'Re-Assigned');
        executeQuery(query).then(data => {
          const msg = {
            to: req.body.assignedTo,
            from: req.headers['authorization'],
            subject: req.body.title,
            cc :  [req.body.supervisor],
            html: `<strong>Hi,</strong>
                    <p> Ticket <strong>${req.body.ticketId}</strong> has been assigned to you.</p>
                    <p><strong>Description : </strong> ${req.body.remarks} </p>
                    <p> Please <a href="http://43.231.124.147:8080/ticket/ticketdetails/" +${ticketId}>Click</a> the link to view more details. </p>


                     <p> Regards,</p>
                     <p>${req.headers['authorization']} </p>
                    `,
          };
          sgMail.send(msg).then(result => {
            logger.info(chalk.green("Mail Sent Successfully"));
          }, err => {
            logger.info(chalk.red(err));
          });
          console.log(msg);
        });
         res.send(data)
       });
    } catch (e) {
      next(e);
    }
  };


  exports.tickets = async(req, res, next) => {  
    try {
      const query = STATUS_COUNT();
      executeQuery(query).then(data => { 
      res.send(data);

    });
    } catch (e) {
      next(e);
    }
  };

  exports.graphData = async(req, res, next) => {  
    try {
      let finalArray = [];
      const query = SELECT_STATUS_COUNT_GROUP_BY();
      executeQuery(query).then(data => { 
       data.forEach((res , index) => {
         let tempArray = [];
         let tempList = {
              name : String, 
              series : [],
            }
        let temp = {
              name : String, 
              value : Number,
        }
        temp.name = "Total",
        temp.value = Number(res['Working']) + Number(res['Pending']) + Number(res['Closed']) + Number(res['Hold']) + Number(res['Start']) ,
        tempArray.push(temp);
      
     if(res['Closed']){
        let temp = {};
        temp.name = "Done",
        temp.value = res['Closed'],
        tempArray.push(temp);
      }
     if(res['Pending']){
        let temp = {};
        temp.name = "Pending + Hold",
        temp.value = Number(res['Pending']) + Number(res['Hold']),
        tempArray.push(temp);
     }
      if(res['Start']){
        let temp = {};
        temp.name = "To Start + Working",
        temp.value = Number(res['Start']) + Number(res['Working']),
        tempArray.push(temp);
      }
      tempList.name = res['assignedTo'];
      tempList.series = tempArray;
      finalArray.push(tempList);
      
      });
  
      res.send(finalArray);
    });
    } catch (e) {
      next(e);
    }
  };

  var dailyJob = scheduler.scheduleJob('30 18 * * 1-5', function(){
    const query= SELECT_NOT_UPDATED_TICKETS_TO_SEND_MAIL();
    executeQuery(query).then(data => { 
      data.forEach((res , index) => {
        const msg = {
          to: res.assignedTo,
          from: 'support@globocom.info',
          subject: res.title,
          html: `<strong>Hi,</strong>
                  <p> As the office timing comes to an end, Kindly update on your ticket <strong>${res.ticketId}</strong>. Please <a href="http://43.231.124.147:8080/ticke/ticketdetails/" +${ticketId}>Click</a>
                   the link to view more details. <p>
                   <p> Please ignore if you have already done. </p>


                   <p> Regards,</p>
                   <p>support@globocom.info</p>
                  `
        };
        sgMail.send(msg).then(result => {
          logger.info(chalk.green("Mail Sent Successfully"));
        }, err => {
          logger.info(chalk.red(err));
        });
      });
    });
   });

   exports.getTicketDetails = async(req, res, next) => {  
    try {
      var ticketId = url.parse(req.url,true).query['ticketId']; 
      const query = SELECT_TICKET_DETAILS_BY_ID(ticketId);
      executeQuery(query).then(data => { 
        // console.log(data);
      res.send(data);
    });
    } catch (e) {
      next(e);
    }
  };

  
  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}
  

exports.getTicketByStatusOrAssignTo = async(req, res, next) => {  
  try {
    let query;
    // console.log(req.body);
    let status = req.body.status;
    if(status=='Total')
      query = SELECT_MY_TICKETS(req.body.assignTo);
    if(status=='Done')
      query = SELECT_COMPLETED_TICKETS(req.body.assignTo);
    if(status=='Pending + Hold')
      query = SELECT_PENDING_HOLD_TICKETS(req.body.assignTo);
    if(status=='To Start + Working')
      query = SELECT_WORKING_TICKETS(req.body.assignTo);
      
    executeQuery(query).then(data => { 
    res.send(data);
  });
  } catch (e) {
    next(e);
  }
};

exports.getNotUpdatedTicket = async(req,res,next) => {
  var date = url.parse(req.url,true).query['date']; 
  // console.log(token);
  const query= SELECT_ALL_PENDING_TICKETS(req.headers['authorization'], date);
    executeQuery(query).then(data => { 
      res.send(data);
    });
  }


exports.getIssueNotUpdatedTicket = async(req,res,next) => {
    var date = url.parse(req.url,true).query['date']; 
    // console.log(token);
    const query= SELECT_ISSUED_NOT_UPDATED_TICKETS(req.headers['authorization'],date);
      executeQuery(query).then(data => { 
        res.send(data);
      });
    }

exports.getTicketsRaisedByMe = async(req,res,next) => {
  // console.log("here");
  try{
    const query= SELECT_ALL_RAISED_TICKET_BY_PERSON(req.headers['authorization']);
    executeQuery(query).then(data => { 
      res.send(data);
    });
  }
  catch(e){
    next(e);
  }
  
}

exports.getClosedTicketsRaisedByMe = async(req,res,next) => {
  try{
  const query= SELECT_CLOSED_TICKET_RAISED_BY_PERSON(req.headers['authorization']);
  executeQuery(query).then(data => { 
    res.send(data);
  });
  } catch(e){
    next(e);
  }
}

exports.getPendingTicketsRaisedByMe = async(req,res,next) => {
  try{
  const query= SELECT_PENDING_TICKET_RAISED_BY_PERSON(req.headers['authorization']);
  executeQuery(query).then(data => { 
    res.send(data);
  });
} catch(e){
  next(e);
}
}

exports.getCountry = async(req,res,next) => {
  try{
    const query= SELECT_COUNTRY();
    executeQuery(query).then(data => { 
      res.send(data);
    });
  }
  catch(e){
    next(e);
  }
}

exports.getTicketByStatus = async(req,res,next) => {
  var status = url.parse(req.url,true).query['status']; 
  console.log(status);
  try{
    const query= SELECT_ALL_TICKET_BY_STATUS(status);
    executeQuery(query).then(data => { 
      res.send(data);
    });
  }
  catch(e){
    next(e);
  }
}

exports.getTicketV2 = async(req,res,next) => {
  console.log(req.body);
  try{
    const query= SELECT_ALL_TICKET_V2(req.body.category,req.body.status,req.body.assignTo);
    executeQuery(query).then(data => { 
      res.send(data);
    });
  }
  catch(e){
    next(e);
  }
}




