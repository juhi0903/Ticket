const Joi = require('joi');

module.exports = {
  // Body needs to contain x-access-token and x-identity-token headers
  authenticated: {
    headers: {
      'x-access-token': Joi.string().required(),
      'x-identity-token': Joi.string().required(),
    },
  },
};
