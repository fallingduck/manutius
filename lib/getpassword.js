const read = require('read')
const bcrypt = require('bcrypt-nodejs')

// Get a password from the user via the console
const getPassword = (callback) => {
  read({prompt: 'Password: ', silent: true}, (err, password) => {
    // Check if user cancelled
    if (err) {
      callback('Operation failed')
      return
    }

    read({prompt: 'Confirm: ', silent: true}, (err, password2) => {
      // Check if user cancelled
      if (err) {
        callback('Operation failed')
        return
      }

      // Check if passwords match
      if (password !== password2) {
        callback('Passwords do not match')
        // If not, try again
        return getPassword(callback)
      }

      // Compute the bcrypt hash
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) throw err
        callback(null, hash)
      })
    })
  })
}

module.exports = getPassword
