var fixPath = require('./fixpath')

var serveStatic = require('serve-static')
var gitServer = require('./gitserver')

var server = require('./server')


/* Begin route definitions */

// // Debugging
// server.route(/.*/, function(req, res, next) {
//   console.log(req.url)
//   next()
// })

// Git server
server.route(
  /^\/site\.git(\/.*)?$/,
  gitServer(fixPath('site'))
)

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
