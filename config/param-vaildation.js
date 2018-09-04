const Joi = require('joi');

module.exports = {
  // POST /api/auth/local
  authLocal: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
};