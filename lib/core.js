var server = require('./server')
var fixpath = require('./fixpath')

var serveStatic = require('serve-static')

var fs = require('fs')
var yaml = require('js-yaml')


/* Begin route definitions */

// Git server
server.route(/^\/site\.git$/, function(req, res, next) {
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
exports.runServer = function (host, port, callback) {
  var serv = server.makeServer()
  serv.listen(port, host, callback)
}
