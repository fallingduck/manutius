var server = require('./lib/server')
var fixpath = require('./lib/fixpath')

var serveStatic = require('serve-static')

var fs = require('fs')
var yaml = require('js-yaml')


/* Begin route definitions */

// Git server
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
fs.readFile(fixpath('config.yaml'), 'utf8', function(e, out) {
  if (e) {
    console.log(e)
    return
  }

  var config = yaml.safeLoad(out)
  var host = config.host
  var port = config.port

  var serv = server.makeServer()

  serv.listen(port, host, function() {
    console.log('Serving on %s:%s...', host, port)
  })
})
