const Joi = require('joi');

module.exports = {
  // POST /v1/ticket/saveTicket
  saveTicket: {
    body: {
      title: Joi.string().required(),
      problemType : Joi.number().required(),
      priorityLevel :Joi.number().required(),
      details : Joi.string().required(),
    }
  },
};
