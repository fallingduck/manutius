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
    console.log('users.json already exists!')
    return
  }

  read({prompt: 'New User: '}, (err, username) => {
    if (err) {
      console.log('\nOperation failed')
      return
    }

    getPassword((err, hash) => {
      if (err) {
        console.log('\n%s', err)
        return
      }

      const users = {}
      users[username] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Initialized user database!')
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
        console.log('\n%s', err)
        return
      }

      const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Added user %s', process.argv[4])
    })
  } else {
    console.log('Usage:')
    console.log('  user add <user>')
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
        console.log('\n%s', err)
        return
      }

      const users = JSON.parse(fs.readFileSync(fixPath('users.json')))
      users[process.argv[4]] = hash
      fs.writeFileSync(fixPath('users.json'), JSON.stringify(users, null, 2))
      console.log('Updated password for user %s', process.argv[4])
    })
  } else {
    console.log('Usage:')
    console.log('  user passwd <user>')
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
    console.log('Deleted user %s', process.argv[4])
  } else {
    console.log('Usage:')
    console.log('  user del <user>')
  }
}

// Create a password hash to be imported by a remote admin
else if (process.argv[2] == 'user' && process.argv[3] == 'export') {
  const getPassword = require('./lib/getpassword')

  getPassword((err, hash) => {
    if (err) {
      console.log('\n%s', err)
      return
    }
    console.log('\'%s\'', hash)
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
    console.log('Added user %s', process.argv[4])
  } else {
    console.log('Usage:')
    console.log('  user import <user> <password-hash>')
    console.log()
    console.log('Get the password hash from the user, it should look similar to:')
    console.log('  $2a$10$znBZF0YPZ1mdqCMdPwnEC.NTgXlXjDyg1x2hTmcTORh3jwi5UGsXO')
  }
}

// Print the help message
else {
  const package = require('./package.json')
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
  console.log('    Change a user\'s password')
  console.log('  user del <user>')
  console.log('    Delete a user')
  console.log('  user export')
  console.log('    Create a user password hash for an admin to import')
  console.log('  user import <user> <password-hash>')
  console.log('    Import a password hash given by a user')
  console.log('  help')
  console.log('    Display this message')
}
