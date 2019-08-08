const ticketQuery = {
    SELECT_TICKETS : () => 'select * from ticket' , 

    SELECT_MY_TICKETS : (payLoad) => `select * from ticket where assignedTo = '${payLoad}'`,

    SELECT_PENDING_HOLD_TICKETS : (payLoad) => `select * from ticket where assignedTo = '${payLoad}' and status in ('Pending From Biller','Hold')`,

    SELECT_COMPLETED_TICKETS : (payLoad) => `select * from ticket where assignedTo = '${payLoad}' and status = 'Closed' `,

    UPDATE_STATUS : (payLoad1,payLoad2,payLoad3,payLoad4) => `update mtix.ticket set status = '${payLoad1}', remarks = '${payLoad2}' , updatedBy = '${payLoad3}' , updatedOn = current_timestamp where ticketId = '${payLoad4}' `,

    INSERT_STATUS_STAGE : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6) => `INSERT INTO mtix.ticket_history (status,stage, subStage,ticketId, remarks, addedOn, addedBy) VALUES ('${payLoad1}','${payLoad2}' ,'${payLoad3}','${payLoad4}','${payLoad5}', current_timestamp,'${payLoad6}')`,

    UPDATE_PRIORITY : (payLoad1,payLoad2,payLoad3) => `update mtix.ticket set priorityLevel = '${payLoad1}' , updatedBy = '${payLoad2}', updatedOn = current_timestamp where id = '${payLoad3}'`,

    UPDATE_ASSIGNTO : (payLoad1,payLoad2,payLoad3,payLoad4) => `update mtix.ticket set assignedTo = '${payLoad1}' , updatedBy = '${payLoad2}', updatedOn = current_timestamp , supervisor = '${payLoad4}' where id = '${payLoad3}'`,

    SELECT_STATUS_COUNT : () => `select count(ticketId) as count ,status from ticket group by 2`,

    SELECT_REMARKS_BY_ID : (payLoad) => `select * from ticket_history where ticketId = '${payLoad}'`,

    UPDATE_REMARKS : (payLoad1,payLoad2,payLoad3, payLoad4) => `update mtix.ticket set remarks = '${payLoad1}' , updatedBy = '${payLoad2}', updatedOn = current_timestamp , status = '${payLoad4}' where ticketId = '${payLoad3}'`,

    INSERT_REMARKS : (payLoad1,payLoad2,payLoad3,payLoad4) => `INSERT INTO mtix.ticket_history (ticketId, remarks, addedOn, addedBy,status) VALUES ('${payLoad1}' ,'${payLoad2}', current_timestamp,'${payLoad3}','${payLoad4}')`,

    SELECT_MAX_ID : () => `SELECT MAX(id) as id FROM mtix.ticket`,

    INSERT_INTEGRATION_TICKET : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11,payLoad12,payLoad13,payLoad14,payLoad15) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status, addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel ,platform, country , operator,billerName,subProblemType,supervisor,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}' ,'${payLoad10}','${payLoad11}','${payLoad12}','${payLoad13}','${payLoad14}','${payLoad15}')`,

    INSERT_NON_INTEGRATION_TICKET : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11,payLoad12,payLoad13) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status,addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel, platform,subProblemType,supervisor,country,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}','${payLoad10}','${payLoad11}','${payLoad12}','${payLoad13}')`,
    SELECT_INTEGRATION_STAGE :() => `select distinct stage from stage_substage`,

    SELECT_INTEGRATION_SUB_STAGE : (payLoad) => `select * from stage_substage where stage = '${payLoad}'`,

    INSERT_STAGE_SUBSTAGE : (payLoad1,payLoad2) => `INSERT INTO stage_substage(stage,subStage) VALUES ('${payLoad1}','${payLoad2}')`,

    INSERT_STATUS : (payLoad1,payLoad4,payLoad5,payLoad6) => `INSERT INTO mtix.ticket_history (status,ticketId, remarks, addedOn, addedBy) VALUES ('${payLoad1}','${payLoad4}','${payLoad5}', current_timestamp,'${payLoad6}')`,

    SELECT_ALL_PENDING_TICKETS : (payLoad1,payLoad2) => `select * from ticket where  date(convert_tz(updatedOn, '+0:00', '+05:30')) <> date(convert_tz('${payLoad2}', '+0:00', '+05:30')) and status <> 'Closed' and raisedBy = '${payLoad1}'`,

    SELECT_CHILD_TICKET : (payLoad) => `select * from ticket where parentTicket = '${payLoad}'`,

    INSERT_INTEGRATION_SUB_TICKET:(payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11,payLoad12, payLoad13,payLoad14,payLoad15,payLoad16) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status, addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel ,platform, country ,operator,billerName,parentTicket,subProblemType,supervisor,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}' ,'${payLoad10}','${payLoad11}','${payLoad12}','${payLoad13}','${payLoad14}','${payLoad15}','${payLoad16}')`,

    INSERT_NON_INTEGRATION_SUB_TICKET : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9, payLoad10,payLoad11,payLoad12,payLoad13) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status,addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel, platform, parentTicket,subProblemType,supervisor,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}','${payLoad10}','${payLoad11}','${payLoad12}','${payLoad13}')`,

    SELECT_TICKET_DETAILS_BY_ID : (payLoad) => `select * from ticket where ticketId = '${payLoad}'`,

    SELECT_PARENT_TICKET_COUNT : (payLoad) => `select count(id) as id from ticket where parentTicket='${payLoad}'`,

    INSERT_PREVIOUS_REMARKS_STAGE : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7) => `INSERT INTO mtix.ticket_history (status,stage, subStage,ticketId, remarks, addedOn, addedBy) VALUES ('${payLoad1}','${payLoad2}' ,'${payLoad3}','${payLoad4}','${payLoad5}','${payLoad6}' , '${payLoad7}')`,

    INSERT_PREVIOUS_REMARKS: (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5) => `INSERT INTO mtix.ticket_history (status,ticketId, remarks, addedOn, addedBy) VALUES ('${payLoad1}','${payLoad2}' ,'${payLoad3}','${payLoad4}','${payLoad5}')`,

    UPDATE_PREVIOUS_REMARKS_STAGE : (payLoad1,payLoad2) => `update mtix.ticket_history set remarks = '${payLoad1}' where id = '${payLoad2}'`,

    INSERT_NON_TECHNICAL_TICKET : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status,addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel,supervisor,country,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}','${payLoad10}' ,'${payLoad11}')`,

    INSERT_NON_TECHNICAL_SUB_TICKET : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11) => `INSERT INTO mtix.ticket (ticketId, raisedBy, assignedTo, status,addedOn, updatedOn, updatedBy, title, description, problemType, priorityLevel,parentTicket,supervisor,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}',current_timestamp,current_timestamp,'${payLoad3}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}','${payLoad10}','${payLoad11}')`,

    UPDATE_FILE_DETAILS : (payLoad1,payLoad2,payLoad3) => `update mtix.ticket set fileName = '${payLoad1}' , filePath = '${payLoad2}' where  ticketId= '${payLoad3}' `,

    INSERT_REMARKS_WITH_FILE: (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6) =>`INSERT INTO mtix.ticket_history (ticketId, remarks, addedOn, addedBy,status,fileName,filePath) VALUES ('${payLoad1}' ,'${payLoad2}', current_timestamp,'${payLoad3}','${payLoad4}','${payLoad5}','${payLoad6}')`,

    INSERT_STATUS_STAGE_FILE_ATTACH : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8) => `INSERT INTO mtix.ticket_history (status,stage, subStage,ticketId, remarks, addedOn, addedBy,fileName,filePath) 
    VALUES ('${payLoad1}','${payLoad2}' ,'${payLoad3}','${payLoad4}','${payLoad5}', current_timestamp,'${payLoad6}','${payLoad7}','${payLoad8}')`,

    INSERT_STAGE_FILE_ATTACH : (payLoad1,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8)=> `INSERT INTO mtix.ticket_history (status,ticketId, remarks, addedOn, addedBy,fileName,filePath) 
    VALUES ('${payLoad1}','${payLoad4}','${payLoad5}', current_timestamp,'${payLoad6}','${payLoad7}','${payLoad8}')`,

    SELECT_TICKET_BY_STATUS_AND_PERSON : (payLoad,payLoad1) => `select * from mtix.ticket where status = '${payLoad}' and assignedTo = '${payLoad1}'`,

    SELECT_ALL_TICKET_BY_STATUS : (payLoad) => `select * from mtix.ticket where status = '${payLoad}'`,

    SELECT_PENDING_TICKET_RAISED_BY_PERSON : (payLoad1) => `select * from mtix.ticket where raisedBy = '${payLoad1}' and status <> 'Closed'`,

    SELECT_CLOSED_TICKET_RAISED_BY_PERSON : (payLoad1) => `select * from mtix.ticket where raisedBy = '${payLoad1}' and status = 'Closed'`,

    SELECT_ALL_RAISED_TICKET_BY_PERSON : (payLoad1) => `select * from mtix.ticket where raisedBy = '${payLoad1}'`,

    // SELECT_STATUS_COUNT_GROUP_BY : () => `select count(ticketId) as count ,status,assignedTo from ticket where status="Closed" group by 3 union select count(ticketId) as count ,status,assignedTo from ticket where status != "Closed" group by 3 order by 3`,

    SELECT_STATUS_COUNT_GROUP_BY : () => `select 
    sum(case when cd.status='Yet To Start' then count else 0 end) as Start, 
    sum(case when cd.status='Hold' then count else 0 end) as Hold, 
    sum(case when cd.status='Closed' then count else 0 end) as Closed, 
    sum(case when cd.status='Pending From Biller' then count else 0 end) as Pending, 
    sum(case when cd.status='Working' then count else 0 end) as Working, 
    sum(case when cd.status='Testing' then count else 0 end) as Testing, 
    sum(case when cd.status='Re-Open' then count else 0 end) as Re-Open,
    sum(case when cd.status='Integration' then count else 0 end) as Integration,
    assignedTo 
    from (select assignedTo,status, count(ticketId) as count from ticket group by 1,2) cd group by 6;`,

    STATUS_COUNT : () => `select  count(ticketId) as count , CASE WHEN status='Closed' THEN 'DONE' WHEN status='Yet To Start' THEN 'YET TO START' WHEN status='Hold' THEN 'HOLD' WHEN status='Pending From Biller' THEN 'PENDING FROM BILLER' when status='Working' then 'WORKING' Else 'OTHER'  END A from  ticket group by 2`,

    INSERT_TICKET_VIA_MAIL : (payLoad1,payLoad2,payLoad3,payLoad4,payLoad5,payLoad6,payLoad7,payLoad8,payLoad9,payLoad10,payLoad11) => `INSERT INTO mtix.ticket(ticketId,raisedBy,title,assignedTo,supervisor,description,status,priorityLevel,problemType,platform,addedOn, updatedOn, updatedBy,reviewer)
    VALUES ('${payLoad1}' ,'${payLoad2}','${payLoad3}','${payLoad4}','${payLoad5}', '${payLoad6}','${payLoad7}','${payLoad8}','${payLoad9}','${payLoad10}',current_timestamp,current_timestamp,'${payLoad4}' ,'${payLoad11}')`,
    

    SELECT_NOT_UPDATED_TICKETS_TO_SEND_MAIL : () => `select * from ticket where  date(updatedOn) <> date(current_timestamp) and status not in ('Closed','Hold')`,

    SELECT_NOT_UPDATED_TICKETS : () => `select * from ticket where  date(updatedOn) <> date(current_timestamp) and status <>'Closed'`,

    UPDATE_REVIEW : (payLoad1,payLoad2) => `update ticket set reviewed=1, updatedBy = '${payLoad2}', updatedOn = current_timestamp where ticketId='${payLoad1}'`,

    INSERT_APPROVAL : (payLoad1,payLoad2) => `update ticket set approved=1, updatedBy = '${payLoad2}', updatedOn = current_timestamp where ticketId='${payLoad1}'`,

    SELECT_REVIEW_TICKET : (payLoad2) => `select ticketId,date(addedOn) as addedOn ,status,title,priorityLevel,assignedTo,raisedBy,problemType from ticket where status!='Yet To Start' and reviewer= '${payLoad2}' and date(convert_tz(addedOn, '+0:00', '+05:30')) > '2019-01-01' and reviewed=0`,

    UPDATE_REMARKS_THROUGH_SCHEDULER : (payLoad1,payLoad2,payLoad3) => `Insert into ticket_history (ticketId,status,addedOn,addedBy) values('${payLoad1}','${payLoad2}',current_timestamp,'${payLoad3}')`,

    SELECT_ISSUED_NOT_UPDATED_TICKETS : (payLoad1,payLoad2) => `select * from ticket where  date(convert_tz(updatedOn, '+0:00', '+05:30')) <> date(convert_tz('${payLoad2}', '+0:00', '+05:30')) and status <> 'Closed' and assignedTo = '${payLoad1}'`,

    SELECT_COUNTRY : () => `select * from country`,

    SELECT_WORKING_TICKETS : (payLoad) => `select * from ticket where assignedTo = '${payLoad}' and status in ('Working','Yet To Start')`,

    SELECT_PENDING_TICKETS : (payLoad) => `select * from ticket where assignedTo = '${payLoad}' and status <> 'Closed'`,

    SELECT_ALL_TICKET_V2 : (payLoad1,payLoad2,payLoad3) => `select * from ticket where problemType = '${payLoad1}' and status <> '${payLoad2}' and reviewer = '${payLoad3}'`

}

module.exports = ticketQuery;