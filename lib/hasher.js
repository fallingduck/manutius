crypto = require('crypto')

module.exports = function(password, hash, callback) {
  if (!hash) {
    crypto.randomBytes(16, function(err, salt) {
      if (err) {
        return callback(err)
      }
      crypto.pbkdf2(password, salt, 65536, 32, 'whirlpool', function(err, newHash) {
        if (err) {
          return callback(err)
        }
        callback(null, Buffer.concat([salt, newHash]).toString('base64'))
      })
    })
  } else {
    var buf = Buffer.from(hash, 'base64')
    var salt = buf.slice(0, 16)
    crypto.pbkdf2(password, salt, 65536, 32, 'whirlpool', function(err, newHash) {
      if (err) {
        return callback(err)
      }
      callback(null, Buffer.concat([salt, newHash]).toString('base64'))
    })
  }
}
