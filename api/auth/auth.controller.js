const compose = require('composable-middleware');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const config = require('../../config/environment');
const async = require('async');
const Gambler = require('../gambler/gambler.model')

let validateJwt = expressJwt({
  secret: config.jwtSecret,
  requestProperty: 'gambler'
});

/**
 * Attaches the gambler object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      validateJwt(req, res, next);
    })
    // Check req.gambler.id in Redis
    .use(function(req, res, next) {
      const gamblerId = req.gambler.id;
      if (gamblerId) {
        Gambler.findById(gamblerId)
          .then(gambler => {
            if (gambler) {
              req.gambler = gambler;
              next();
            } else {
              return res.status(401).end();
            }
          })
          .catch(e=>next(e));
      } else {
        return res.status(401).end();
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ id }, config.jwtSecret);
}

module.exports = { isAuthenticated, signToken };
