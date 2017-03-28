var server = require('./lib/server')
var yaml = require('js-yaml')
var fs = require('fs')


/* Begin route definitions */

server.route(/^\/\.git$/, function(req, res) {
  res.end('git server')
})

server.route(/.*/, function(req, res) {
  res.end('static file server')
})

/* End route definitions */


// Create the server
var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
host = config.host
port = config.port

var server = server.makeServer()

server.listen(port, host, function() {
  console.log('Serving on %s:%s...', host, port)
})
