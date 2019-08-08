const httpStatus = require('http-status');
const responseService = require('../services/response.service');
const {executeQuery} = require('../repository/index');
// var request = require("request");
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const session = require('../../config/session.js');
var jwtDecode = require('jwt-decode');
var url = require('url');
// var session = require('express-session');
const path = require('path');
const multer = require('multer');
const scheduler = require('node-schedule');
var fs = require('fs'), fileStream;
var Imap = require('imap'),
  inspect = require('util').inspect;
const sess = session;
var DomParser = require('dom-parser');
var cheerio = require("cheerio");
const sgMail = require('@sendgrid/mail');
const logger = require('../../api/utils/logger');
const chalk = require('chalk');

// const DIR = './uploads';
const {SELECT_MAX_ID, INSERT_TICKET_VIA_MAIL} = require('../repository/mysql/queries');
 

var imap = new Imap({
  user: "mtix@globocom.info",
  password: "Globo#1302",
  host: "imap.gmail.com", 
  port: 993,
  tls: true,
});

exports.allusers = (req, res, next) => {
  try {
    const query = `select * from mtix.users`;
    executeQuery(query).then(data => {res.send(data)
      // console.log(data);
    });
  } catch (e) {
    next(e);
  }
}

exports.verify = (req, res, next) => {
    try {
      res.redirect('http://matrixads.in/matrix/mtix/auth');
    } catch (e) {
      next(e);
    }
};

exports.auth = async(req,res,next) => {
  try {
    var token = url.parse(req.url,true).query['token']; 
       
    // var token = `eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJqdWhpLnNpbmdoQGdsb2JvY29tLmluZm8iLCJpc3MiOiJqdWhpIiwiaWF0IjoxNTM5NjI3MTYwfQ.rgPn__4oxBuXK_pxChymaWruHmKvVqXsNHMMH5SmQBw`; 
    
    jwt.verify(token, "usingmatixtokenformtixloginwaaaaahhhwaaaaahhhhwaaaaaahhh" ,{ expiresIn: 3000}, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      res.redirect('http://43.231.124.147:8080/dashboard?auth='+token);
      // res.redirect('http://localhost:4200/dashboard?auth='+token);
    });
  }
  catch (e) {
    next(e);
  }
};

exports.upload = (req, res) => {
  try{
    res.send('File uploaded successfully! -> filename = ' + req.file.filename);
  }
  catch(e){
    next(e);
  }
	
}

exports.emailId = (req,res) => {
  try{
    const query = `select emailId as name from mtix.users`;
    executeQuery(query).then(data => {res.send(data)
      // console.log(data);
    });
  }
  catch(e){
    next(e);
  }
}
 
// exports.listUrlFiles = (req, res) => {
// 	fs.readdir(uploadFolder, (err, files) => {
// 		for (let i = 0; i < files.length; ++i) {
// 			files[i] = "http://localhost:4200/api/file/" + files[i];
// 		}
		
// 		res.send(files);
// 	})
// }
 
exports.downloadReport = (req, res) => {
  res.sendFile(req.body.filename); 
};


var dailyJob = scheduler.scheduleJob('*/5 * * * *', function(){
  console.log(">>>>>>>>>> Mail Check Scheduler >>>>>>>>Every 5 mins>>>>>>>>>>");
  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      imap.search(['UNSEEN',['SINCE', 'December 18, 2018']], function(err, results) {
        if (err) throw err;
      if(results.length>0){
      var f = imap.fetch(results, { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE CC)','TEXT'] ,markSeen: true }); //
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          stream.once('end', function() {
            if (info.which !== 'TEXT'){
              const  maildata = {
                details : String,
                assignedTo : String, 
                title : String,
                supervisor : String,
                status : String,
                raisedBy : String,
                problemType : String,
                priority : String,
                platform : String
              }
              console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              let d = Imap.parseHeader(buffer);
              maildata['raisedBy'] = d['from'].toString().split("<")[1].split(">")[0];
              maildata['title']= d['subject'].toString().split("[")[0];
              if(d.hasOwnProperty('cc')){
                let arr = d['cc'].toString().split("<");
                if(arr.length>=3){
                maildata['assignedTo'] = d['cc'].toString().split("<")[1].split(">")[0];
                maildata['supervisor']= d['cc'].toString().split("<")[2].split(">")[0];
                maildata['status'] = 'Yet To Start';
               
                raiseNewTicket(maildata); 
                
                }
                else{
                  errorMail(maildata);
                }
              }
              else{
                errorMail(maildata);
              }
              
            }
            else
              console.log(prefix + 'Body [%s] Finished', inspect(info.which));
    
          });
        });
      });
        msg.once('attributes', function(attrs) {
          // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
      }
      else{
        console.log("Nothing to fetch");
      }
    });
  });
});

  imap.once('error', function (err) {
    console.log(err);
  });
  
  imap.once('end', function () {
    console.log('Connection ended');
  });
  
  imap.connect(); 

});

function openInbox(cb) {
  imap.openBox('INBOX', false, cb);
}

function raiseNewTicket(maildata) {

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
   const problemType = [
    {name: 'Finance'},
    {name: 'HR'},
    {name: 'Marketing'},
    {name: 'Technical'},
    {name: 'Aliance'},
    {name: 'Media Buying'},
    {name: 'Advertising'}, 
    {name: 'Billing'},
    {name: 'Application'},
    {name: 'Content'},
    {name: 'Analytics'}
  ]
  const platform = [
    {name: 'Matrix'},
    {name: 'MGlobo Pay'},
    {name: 'GloboBill'},
    {name: 'Ginger'},
    {name: 'CMS'},
    {name: 'App'},
    {name: 'Mtix'}
  ]

  platform.forEach((res,next) => {
    if(maildata.title.toString().includes(res['name']))
      maildata['platform'] = res['name'];
    else
    maildata['platform'] = 'OTHR';
  });

  problemType.forEach((res,next)=>{
    if(maildata.title.toString().includes(res['name'])){
      maildata['problemType'] = res['name'];
      console.log("matched" , res['name']);
    }
    else
    maildata['problemType'] = 'OTHR';
  });
    maildata['priority'] = 'Moderate';
    maildata['details'] = 'As sent in mail';
  let query = SELECT_MAX_ID();
  executeQuery(query).then(data => {
   const ticketId = 'Globo_' + data[0].id;
   let reviewer ="rv@globocom.info";
   let query = INSERT_TICKET_VIA_MAIL(ticketId,maildata.raisedBy,maildata.title,maildata.assignedTo,maildata.supervisor,maildata.details,maildata.status,maildata.priority, maildata.problemType,maildata.platform,reviewer);  //  executeQuery(query).then(data => {
    executeQuery(query).then(data => {
   const msg = {
      to: maildata.assignedTo,
      from: maildata.raisedBy,
      subject: maildata.title, 
      cc :  [maildata.supervisor],           
      html: `<strong>Hi,</strong>
                    <p> New Ticket <strong>${ticketId}</strong> has been raised to you. </p>
                     <p><strong>Description : </strong> As sent in above mail </p>
                     <p> Please <a href="http://43.231.124.147:8080/ticket/ticketdetails/" +${ticketId}>Click</a> the link to view more details. </p>
    
                     <p> Regards</p>
                    `,
        };
    console.log(msg);
      sgMail.send(msg).then(result => {
        logger.info(chalk.green("Mail Sent Successfully"));
      }, err => {
        logger.info(chalk.red(err));
      });
    });
  });
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
}

function errorMail(maildata){
  const msg = {
    to: maildata.raisedBy,
    from: 'mtix@globocom.info',
    subject: maildata.title,           
    html: `<p style="color:red";><strong>ATTENTION !!!!!</strong><p>
                  <p> Ticket has not been raised , as less than two members are in 'CC' </p>
  
                   <p> Regards,</p>
                   <p> System </p>
                  `,
      };
  console.log(msg);
    sgMail.send(msg).then(result => {
      logger.info(chalk.green("Mail Sent Successfully"));
    }, err => {
      logger.info(chalk.red(err));
    });
}
