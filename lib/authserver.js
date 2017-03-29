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
  return function(req, res, next) {
    var unauthorized = function() {
      res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required')
      res.statusCode = 401
      return res.end()
    }

    var user = auth(req)
    if (!user || !user.name || !user.pass) {
      return unauthorized()
    }

    checkAuth(configPath, user.name, user.pass, function(result) {
      if (result) {
        console.log('User authenticated: %s', user.name)
        return next()
      } else {
        return unauthorized()
      }
    })
  }
}
