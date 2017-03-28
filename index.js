var server = require('./lib/server')
var fixpath = require('./lib/fixpath')

var serveStatic = require('serve-static')

var fs = require('fs')
var yaml = require('js-yaml')


/* Begin route definitions */

// Define the git server
server.route(/^\/\.git$/, function(req, res, next) {
  res.end('git server')
})

// Static site server
server.route(
  /.*/,
  serveStatic(fixpath('site/www'), {'index': ['index.html', 'index.htm']})
)

// Handle 404
server.route(/.*/, function(req, res) {
  res.end('handle 404')
})

/* End route definitions */


// Create the server
var config = yaml.safeLoad(fs.readFileSync(fixpath('config.yaml'), 'utf8'))
host = config.host
port = config.port

var server = server.makeServer()

server.listen(port, host, function() {
  console.log('Serving on %s:%s...', host, port)
})
