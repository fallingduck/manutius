var fs = require('fs')
var auth = require('basic-auth')
var hasher = require('./hasher')

var checkAuth = function(configPath, username, password, callback) {
  fs.readFile(configPath, 'utf8', function(err, data) {
    if (err) {
      return callback(false)
    }
    var config = JSON.parse(data)
    var hash = config[username]
    if (!hash) {
      return callback(false)
    }
    hasher(password, hash, function(err, newHash) {
      if (err) {
        return callback(false)
      }
      return callback(newHash === hash)
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

    // Check blacklist
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
        console.log('User authenticated: %s', user.name)
        // Clear the blacklist counter
        delete blacklistCounter[req.connection.remoteAddress]
        return next()
      } else {
        // If exceeded 3 tries, add to blacklist for 30 minutes
        if (req.connection.remoteAddress in blacklistCounter) {
          if (blacklistCounter[req.connection.remoteAddress] >= 3) {
            delete blacklistCounter[req.connection.remoteAddress]
            blacklist[req.connection.remoteAddress] = Math.floor(new Date() / 1000) + 1800
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