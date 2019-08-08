const httpStatus = require('http-status');
const responseService = require('../services/response.service');
const logger = require('../../api/utils/logger');
const chalk = require('chalk');
const {executeQuery} = require('../repository/index');
const scheduler = require('node-schedule');
const sgMail = require('@sendgrid/mail');
const url = require('url');
const { SELECT_REMARKS_BY_ID , UPDATE_REMARKS , INSERT_REMARKS, INSERT_REMARKS_WITH_FILE, UPDATE_REVIEW, INSERT_APPROVAL,SELECT_REVIEW_TICKET,SELECT_NOT_UPDATED_TICKETS,UPDATE_REMARKS_THROUGH_SCHEDULER,SELECT_MY_TICKETS} = require('../repository/mysql/queries')

exports.getRemarks =  async(req,res,next) => {
    try {
        var ticketId = url.parse(req.url,true).query['ticketId']; 
        const query = SELECT_REMARKS_BY_ID(ticketId);
         executeQuery(query).then(data => {
          
           res.send(data)
         });
      } catch (e) {
        next(e);
      }
};

exports.post = async(req,res,next) => {
    try {
        // console.log(req.body)
       let query;
       query = UPDATE_REMARKS(req.body.remarks,req.headers['authorization'],req.body.ticketId,req.body.status);
       executeQuery(query).then(data => {
        if(req.body.hasOwnProperty('fileName')){
          query = INSERT_REMARKS_WITH_FILE(req.body.ticketId,req.body.remarks,req.headers['authorization'],req.body.status,req.body.fileName,req.body.filePath);
        }
        else{
         query = INSERT_REMARKS(req.body.ticketId,req.body.remarks,req.headers['authorization'],req.body.status);
        }
        executeQuery(query).then(data => {
        });
        res.send(data)
       });
    } catch (e) {
      next(e);
    }
  

  };

  exports.getReviewTicket =  async(req,res,next) => {
    // console.log(req.headers['authorization']);
    try {
        const query = SELECT_REVIEW_TICKET(req.headers['authorization']);
         executeQuery(query).then(data => {
          res.send(data)
         });
      } catch (e) {
        next(e);
      }
  };

  exports.updateReview = async(req,res,next) => {
    try{
    const query= UPDATE_REVIEW(req.body.ticketId,req.headers['authorization']);
    executeQuery(query).then(data => { 
      const query = INSERT_REMARKS(req.body.ticketId,req.body.remarks,req.headers['authorization'],req.body.status);
      executeQuery(query).then(data => { 
      });
      res.send(data);
    });
  } catch(e){
    next(e);
  }
  };

  exports.approveTicket = async(req,res,next) => {
    var ticketId = url.parse(req.url,true).query['ticketId'];
    try{
    const query= INSERT_APPROVAL(ticketId,req.headers['authorization']);
    executeQuery(query).then(data => { 
      res.send(data);
    });
  } catch(e){
    next(e);
  }
  };

  var dailyJob = scheduler.scheduleJob('30 10 * * 1-5', function(){

    console.log("Review Ticket Scheduler>>>>>>>");
    techLeads = [
      {name: 'rv@globocom.info'},
      {name: 'pankaj@globocom.info'},
      {name: 'saji@globocom.info'},
    ]

    techLeads.forEach(data =>{
    const query = SELECT_REVIEW_TICKET(data.name);
     
    executeQuery(query).then(result => {
     tableData = [];
     tableBody = '';
      // console.log(result);
      result.forEach(element => {
              tableData.push(`<tr>
                              <td style="border:1px solid black;">${element.ticketId}</td>
                              <td style="border:1px solid black">${element.addedOn.toString().substring(4,15)}</td>
                              <td style="border:1px solid black;">${element.title}</td>
                              <td style="border:1px solid black;">${element.assignedTo}</td>
                              <td style="border:1px solid black;">${element.raisedBy}</td>
                              <td style="border:1px solid black;">${element.priorityLevel}</td>
                              <td style="border:1px solid black;">${element.status}</td>
                              <td style="border:1px solid black;">${element.problemType}</td>
                            </tr>
                            `)
        });
        tableData.forEach(data1 => {
              tableBody += data1;	
            });
        const msg = {
          to: data.name,
          from: 'support@globocom.info',
          subject: `Tickets Need to be Reviewed `,
          html: `<strong>Hi,</strong>
                  <p Style="color:Red;"> <strong>GENTAL REMINDER!!!</strong> </p>
                  <p>Below are the tickets need to reviewed.</p>
                    <table style="width:100%; border:1px solid black;">
                    <thead >
                    <tr>
                      <th style="border:1px solid black;">Ticket Id</th>
                      <th style="border:1px solid black;">Raised Date</th>
                      <th style="border:1px solid black;">Subject</th> 
                      <th style="border:1px solid black;">Assigned To</th>
                      <th style="border:1px solid black;">Raised By</th>
                      <th style="border:1px solid black;">Priority</th>
                      <th style="border:1px solid black;">Status</th>
                      <th style="border:1px solid black;">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                      ${tableBody}
                    </tbody>
                    </table>

                   <p> Regards,</p>
                   <p>support@globocom.info</p>
                  `
        };
        // console.log(msg);
        sgMail.send(msg).then(result => {
          logger.info(chalk.green("Mail Sent Successfully"));
        }, err => {
          logger.info(chalk.red(err));
        });
      });
    });
   });

var updateRemark = scheduler.scheduleJob('55 22 * * 1-5', function(){

    let query = SELECT_NOT_UPDATED_TICKETS();

    executeQuery(query).then(data => {
      console.log("Update Remarks Scheduler>>>>>>>",data.length);

      data.forEach(result => {
      let addedBy = 'System';
      let status = result.status;
      if(status=='Hold')
      status = 'Hold';
      else if(status == 'Yet To Start')
      status = 'Yet To Start';
      else
      status = 'Not Updated';
      query = UPDATE_REMARKS_THROUGH_SCHEDULER(result.ticketId,status,addedBy);
      executeQuery(query).then(result => {
      });
    });
  });
});


