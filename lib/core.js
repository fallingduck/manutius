var server = require('./server')
var fixPath = require('./fixpath')

var serveStatic = require('serve-static')


/* Begin route definitions */

// Git server
server.route(/^\/site\.git$/, function(req, res, next) {
  res.end('git server')
})

// Static site server
server.route(
  /.*/,
  serveStatic(fixPath('site/www'), {'index': ['index.html', 'index.htm']})
)

// Handle 404
server.route(/.*/, function(req, res) {
  res.end('handle 404')
})

/* End route definitions */


// Create the server
exports.runServer = function (port, host, callback) {
  var serv = server.makeServer()
  serv.listen(port, host, callback)
}
