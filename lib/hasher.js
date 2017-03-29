crypto = require('crypto')

module.exports = function(password, hash, callback) {
  if (!hash) {
    crypto.randomBytes(16, function(err, salt) {
      if (err) {
        callback(err)
        return
      }
      var hash1 = crypto.createHash('whirlpool')
      hash1.update(password)
      hash1.update(salt)
      var hash2 = crypto.createHash('sha256')
      hash2.update(hash1.digest())
      hash2.update(password)
      hash2.update(salt)
      callback(null, Buffer.concat([salt, hash2.digest()]).toString('base64'))
    })
  } else {
    var buf = Buffer.from(hash, 'base64')
    var salt = buf.slice(0, 16)
    var hash1 = crypto.createHash('whirlpool')
    hash1.update(password)
    hash1.update(salt)
    var hash2 = crypto.createHash('sha256')
    hash2.update(hash1.digest())
    hash2.update(password)
    hash2.update(salt)
    callback(null, Buffer.concat([salt, hash2.digest()]).toString('base64'))
  }
}
