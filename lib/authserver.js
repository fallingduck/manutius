const fs = require('fs')
const auth = require('basic-auth')
const bcrypt = require('bcryptjs')
const logger = require('./logger')

// Verify the credentials based on the user database on disk
const checkAuth = (configPath, username, password, callback) => {
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      logger.logWarn(err)
      return callback(false)
    }

    const config = JSON.parse(data)
    const hash = config[username]
    if (!hash) {
      return callback(false)
    }

    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        logger.logWarn(err)
        return callback(false)
      }

      return callback(res)
    })
  })
}

module.exports = (configPath) => {
  const blacklistCounter = {}
  const blacklist = {}

  return (req, res, next) => {
    const unauthorized = () => {
      res.setHeader('WWW-Authenticate', 'Basic realm=Authorization Required')
      res.statusCode = 401
      return res.end()
    }

    // Check whitelist
    if (req.connection._authed) {
      return next()
    }

    // Check blacklist
    if (req.connection.remoteAddress in blacklist) {
      if (blacklist[req.connection.remoteAddress] <= Math.floor(new Date() / 1000)) {
        delete blacklist[req.connection.remoteAddress]
      } else {
        return unauthorized()
      }
    }

    const user = auth(req)
    if (!user || !user.name || !user.pass) {
      return unauthorized()
    }

    checkAuth(configPath, user.name, user.pass, (result) => {
      if (result) {
        logger.logInfo('User authenticated: %s (%s:%s)', user.name, req.connection.remoteAddress, req.connection.remotePort)

        // Add socket to whitelist
        req.connection._authed = true

        // Clear the blacklist counter
        delete blacklistCounter[req.connection.remoteAddress]

        return next()
      } else {
        // If exceeded 3 tries, add to blacklist for 30 minutes
        if (req.connection.remoteAddress in blacklistCounter) {
          if (blacklistCounter[req.connection.remoteAddress] >= 2) {
            // Clean up blacklist
            if (Object.keys(blacklist).size > 100) {
              for (let address in blacklist) {
                if (blacklist[address] <= Math.floor(new Date() / 1000)) {
                  delete blacklist[address]
                }
              }
            }
            // Add to blacklist
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
