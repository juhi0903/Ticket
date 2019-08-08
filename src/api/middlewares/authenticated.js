const httpStatus = require('http-status');

const responses = require('../services/response.service');

module.exports = async (req, res) => {
  const response = responses.authenticated();
  res.send(httpStatus.OK).send(response);
};
