const httpStatus = require('http-status');
const responseService = require('../services/response.service');
const logger = require('../../api/utils/logger');
const chalk = require('chalk');
const {executeQuery} = require('../repository/index');
const url = require('url');
const { SELECT_INTEGRATION_STAGE , SELECT_INTEGRATION_SUB_STAGE , INSERT_STAGE_SUBSTAGE} = require('../repository/mysql/queries')

exports.getStages =  async(req,res,next) => {
    try {
        const query = SELECT_INTEGRATION_STAGE();
         executeQuery(query).then(data => {
           res.send(data)
         });
      } catch (e) {
        next(e);
      }
};

exports.getSubStages = async(req,res,next) => {
    try {
      const query = SELECT_INTEGRATION_SUB_STAGE(req.body.stage);
       executeQuery(query).then(data => {
        res.send(data)
       });
    } catch (e) {
      next(e);
    }
};

exports.saveStage = async(req,res,next) => {
    try {
      const query = INSERT_STAGE_SUBSTAGE(req.body.stage,req.body.subStage);
       executeQuery(query).then(data => {
        res.send(data)
       });
    } catch (e) {
      next(e);
    }
};