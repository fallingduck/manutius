// Start the server
if (process.argv[2] == 'serve') {
  var fixPath = require('./lib/fixpath')
  var core = require('./lib/core')
  var fs = require('fs')
  var yaml = require('js-yaml')
  var logger = require('./lib/logger')

  fs.readFile(fixPath('config.yaml'), 'utf8', function(err, out) {
    if (err) throw err
    var config = yaml.safeLoad(out)
    var host = config.host
    var port = config.port
    core.runServer(port, host, function() {
      logger.logInfo('Serving on %s:%s...', host, port)
    })
  })
}

// Create a password hash
else if (process.argv[2] == 'passwd') {
  var read = require('read')
  var hasher = require('./lib/hasher')
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
        return
      }
      hasher(password, null, function(err, hash) {
        if (err) throw err
        console.log(hash)
      })
    })
  })
}

// Print the help message
else {
  var package = require('./package.json')
  console.log('%s v%s', package.name, package.version)
  console.log(package.description)
  console.log()
  console.log('Available commands:')
  console.log('  serve')
  console.log('  help')
}
