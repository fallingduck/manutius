// Start the server
if (process.argv.length <= 2 || process.argv[2] == 'serve') {
  var fixPath = require('./lib/fixpath')
  var core = require('./lib/core')
  var fs = require('fs')
  var yaml = require('js-yaml')

  fs.readFile(fixPath('config.yaml'), 'utf8', function(e, out) {
    if (e) {
      console.log(e)
      return
    }

    var config = yaml.safeLoad(out)
    var host = config.host
    var port = config.port
    core.runServer(port, host, function() {
      console.log('Serving on %s:%s...', host, port)
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
