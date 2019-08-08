const Joi = require('joi');

module.exports = {
  // POST /v1/user/me
  me: {
    body: {
      username: Joi.string().required()
    },
  },
};
