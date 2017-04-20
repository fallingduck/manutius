const print = console.log

// Start the server
if (process.argv[2] == 'start') {
  const fixPath = require('./lib/fixpath')
  const core = require('./lib/core')
  const logger = require('./lib/logger')

  const config = require(fixPath('config.json'))
  const host = config.host
  const port = config.port

  core.runServer(port, host, () => {
    logger.logInfo('Serving on %s:%s', host, port)
  })
}

// Initialize the user database (should be run before any 'user' commands)
else if (process.argv[2] == 'init') {
  const fs = require('fs')
  const read = require('read')
  const getPassword = require('./lib/getpassword')
  const fixPath = require('./lib/fixpath')

  if (fs.existsSync(fixPath('users.json'))) {
    print('users.json already exists!')
    return
  }

  read({prompt: 'New User: '}, (err, username) => {
    if (err) {
      print('\nOperation failed')
      return
    }

    getPassword((err, hash) => {
      if (err) {
        print('\n%s', err)
        return
      }

      const users = {}
      users[username] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      print('Initialized user database!')
    })
  })
}

// Add a user
else if (process.argv[2] == 'user' && process.argv[3] == 'add') {
  if (process.argv[4]) {
    const fs = require('fs')
    const getPassword = require('./lib/getpassword')
    const fixPath = require('./lib/fixpath')

    getPassword((err, hash) => {
      if (err) {
        print('\n%s', err)
        return
      }

      const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      print('Added user %s', process.argv[4])
    })
  } else {
    print('Usage:')
    print('  user add <user>')
  }
}

// Change a user's password
else if (process.argv[2] == 'user' && process.argv[3] == 'passwd') {
  if (process.argv[4]) {
    const fs = require('fs')
    const getPassword = require('./lib/getpassword')
    const fixPath = require('./lib/fixpath')

    getPassword((err, hash) => {
      if (err) {
        print('\n%s', err)
        return
      }

      const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      print('Updated password for user %s', process.argv[4])
    })
  } else {
    print('Usage:')
    print('  user passwd <user>')
  }
}

// Delete a user
else if (process.argv[2] == 'user' && process.argv[3] == 'del') {
  if (process.argv[4]) {
    const fs = require('fs')
    const fixPath = require('./lib/fixpath')

    const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
    delete users[process.argv[4]]
    fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
    print('Deleted user %s', process.argv[4])
  } else {
    print('Usage:')
    print('  user del <user>')
  }
}

// Create a password hash to be imported by a remote admin
else if (process.argv[2] == 'user' && process.argv[3] == 'export') {
  const getPassword = require('./lib/getpassword')

  getPassword((err, hash) => {
    if (err) {
      print('\n%s', err)
      return
    }
    print('\'%s\'', hash)
  })
}

// Import a new user with a user-provided password hash
else if (process.argv[2] == 'user' && process.argv[3] == 'import') {
  if (process.argv[4] && process.argv[5]) {
    const fs = require('fs')
    const fixPath = require('./lib/fixpath')

    const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
    users[process.argv[4]] = process.argv[5]
    fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
    print('Added user %s', process.argv[4])
  } else {
    print('Usage:')
    print('  user import <user> <password-hash>')
    print()
    print('Get the password hash from the user, it should look similar to:')
    print('  $2a$10$znBZF0YPZ1mdqCMdPwnEC.NTgXlXjDyg1x2hTmcTORh3jwi5UGsXO')
  }
}

// Print the help message
else {
  const package = require('./package.json')
  print('%s v%s', package.name, package.version)
  print(package.description)
  print()
  print('Available commands:')
  print('  init')
  print('    Initialize the user database with a new user')
  print('  serve')
  print('    Start the server')
  print('  user add <user>')
  print('    Add a user to the user database')
  print('  user passwd <user>')
  print('    Change a user\'s password')
  print('  user del <user>')
  print('    Delete a user')
  print('  user export')
  print('    Create a user password hash for an admin to import')
  print('  user import <user> <password-hash>')
  print('    Import a password hash given by a user')
  print('  help')
  print('    Display this message')
}
