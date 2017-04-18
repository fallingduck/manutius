/* Get a password from the user via the console */
var getPassword = function(callback) {
  var read = require('read')
  var bcrypt = require('bcrypt-nodejs')
  read({prompt: 'Password: ', silent: true}, function(err, password) {
    if (err) {
      console.log('\nOperation failed')
      return
    }
    read({prompt: 'Confirm: ', silent: true}, function(err, password2) {
      if (err) {
        console.log('\nOperation failed')
        return
      }
      if (password !== password2) {
        console.log('Passwords do not match')
        return getPassword(callback)
      }
      bcrypt.hash(password, null, null, function(err, hash) {
        if (err) throw err
        callback(hash)
      })
    })
  })
}


/* Initialize the user database (should be run before any 'user' commands) */
if (process.argv[2] == 'init') {
  var fs = require('fs')
  var read = require('read')
  var fixPath = require('./lib/fixpath')

  if (fs.existsSync(fixPath('users.json'))) {
    console.log('users.json already exists!')
    return
  }

  read({prompt: 'New User: '}, function(err, username) {
    if (err) {
      console.log('\nOperation failed')
      return
    }
    getPassword(function(hash) {
      var users = {}
      users[username] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Initialized user database!')
    })
  })
}

/* Start the server */
else if (process.argv[2] == 'serve') {
  var fixPath = require('./lib/fixpath')
  var core = require('./lib/core')
  var logger = require('./lib/logger')

  var config = require(fixPath('config.json'))
  var host = config.host
  var port = config.port
  core.runServer(port, host, function() {
    logger.logInfo('Serving on %s:%s', host, port)
  })
}

/* Add a user */
else if (process.argv[2] == 'user' && process.argv[3] == 'add') {
  if (process.argv[4]) {
    getPassword(function(hash) {
      var fs = require('fs')
      var fixPath = require('./lib/fixpath')

      var users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Added user %s', process.argv[4])
    })
  } else {
    console.log('Usage:')
    console.log('  user add <user>')
  }
}

/* Change a user's password */
else if (process.argv[2] == 'user' && process.argv[3] == 'passwd') {
  if (process.argv[4]) {
    getPassword(function(hash) {
      var fs = require('fs')
      var fixPath = require('./lib/fixpath')

      var users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Updated password for user %s', process.argv[4])
    })
  } else {
    console.log('Usage:')
    console.log('  user passwd <user>')
  }
}

/* Delete a user */
else if (process.argv[2] == 'user' && process.argv[3] == 'del') {
  if (process.argv[4]) {
    var fs = require('fs')
    var fixPath = require('./lib/fixpath')

    var users = JSON.parse(fs.readFileSync(fixPath('users.json')))
    delete users[process.argv[4]]
    fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
    console.log('Deleted user %s', process.argv[4])
  } else {
    console.log('Usage:')
    console.log('  user del <user>')
  }
}

/* Create a password hash to be imported by a remote admin */
else if (process.argv[2] == 'user' && process.argv[3] == 'export') {
  getPassword(console.log)
}

/* Import a new user with a user-provided password hash */
else if (process.argv[2] == 'user' && process.argv[3] == 'import') {
  if (process.argv[4] && process.argv[5]) {
    var fs = require('fs')
    var fixPath = require('./lib/fixpath')

    var users = JSON.parse(fs.readFileSync(fixPath('users.json')))
    users[process.argv[4]] = process.argv[5]
    fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
    console.log('Added user %s', process.argv[4])
  } else {
    console.log('Usage:')
    console.log('  user import <user> <password-hash>')
    console.log()
    console.log('Get the password hash from the user, it should look similar to:')
    console.log('  $2a$10$znBZF0YPZ1mdqCMdPwnEC.NTgXlXjDyg1x2hTmcTORh3jwi5UGsXO')
  }
}

/* Print the help message */
else {
  var package = require('./package.json')
  console.log('%s v%s', package.name, package.version)
  console.log(package.description)
  console.log()
  console.log('Available commands:')
  console.log('  init')
  console.log('    Initialize the user database with a new user')
  console.log('  serve')
  console.log('    Start the server')
  console.log('  user add <user>')
  console.log('    Add a user to the user database')
  console.log('  user passwd <user>')
  console.log("    Change a user's password")
  console.log('  user del <user>')
  console.log('    Delete a user')
  console.log('  user export')
  console.log('    Create a user password hash for an admin to import')
  console.log('  user import <user> <password-hash>')
  console.log('    Import a password hash given by a user')
  console.log('  help')
  console.log('    Display this message')
}
