var fs = require('fs')
var auth = require('basic-auth')
var bcrypt = require('bcrypt-nodejs')
var logger = require('./logger')

/* Verify the credentials based on the user database on disk */
var checkAuth = function(configPath, username, password, callback) {
  fs.readFile(configPath, 'utf8', function(err, data) {
    if (err) {
      logger.logWarn(err)
      return callback(false)
    }
    var config = JSON.parse(data)
    var hash = config[username]
    if (!hash) {
      return callback(false)
    }
    bcrypt.compare(password, hash, function(err, res) {
      if (err) {
        logger.logWarn(err)
        return callback(false)
      }
      return callback(res)
    })
  })
}

module.exports = function(configPath) {
  var blacklistCounter = {}
  var blacklist = {}
  return function(req, res, next) {
    var unauthorized = function() {
      res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required')
      res.statusCode = 401
      return res.end()
    }

    /* Check blacklist */
    if (req.connection.remoteAddress in blacklist) {
      if (blacklist[req.connection.remoteAddress] <= Math.floor(new Date() / 1000)) {
        delete blacklist[req.connection.remoteAddress]
      } else {
        return unauthorized()
      }
    }

    var user = auth(req)
    if (!user || !user.name || !user.pass) {
      return unauthorized()
    }

    checkAuth(configPath, user.name, user.pass, function(result) {
      if (result) {
        logger.logInfo('User authenticated: %s (%s:%s)', user.name, req.connection.remoteAddress, req.connection.remotePort)
        /* Clear the blacklist counter */
        delete blacklistCounter[req.connection.remoteAddress]
        return next()
      } else {
        /* If exceeded 3 tries, add to blacklist for 30 minutes */
        if (req.connection.remoteAddress in blacklistCounter) {
          if (blacklistCounter[req.connection.remoteAddress] >= 2) {
            delete blacklistCounter[req.connection.remoteAddress]
            blacklist[req.connection.remoteAddress] = Math.floor(new Date() / 1000) + 1800
            logger.logInfo('Blacklisted IP: %s', req.connection.remoteAddress)
          } else {
            blacklistCounter[req.connection.remoteAddress] += 1
          }
        } else {
          blacklistCounter[req.connection.remoteAddress] = 1
        }
        return unauthorized()
      }
    })
  }
}
