fixpath = require('./lib/fixpath')
core = require('./lib/core')

fs = require('fs')
yaml = require('js-yaml')

fs.readFile(fixpath('config.yaml'), 'utf8', function(e, out) {
  if (e) {
    console.log(e)
    return
  }

  var config = yaml.safeLoad(out)
  var host = config.host
  var port = config.port
  core.runServer(host, port, function() {
    console.log('Serving on %s:%s...', host, port)
  })
})
