var fixPath = require('./fixpath')

var serveStatic = require('serve-static')
var authServer = require('./authserver')
var gitServer = require('./gitserver')
var fileServer = require('./fileserver')
var server = require('./server')
var logger = require('./logger')

var config = require(fixPath('config.json'))


/* Begin route definitions */

// // Debugging
// server.route(/.*/, function(req, res, next) {
//   console.log(req.url)
//   next()
// })

// Git server authorization
server.route(
  /^\/site\.git(\/.*)?$/,
  authServer(fixPath('users.json'))
)

// Git server
server.route(
  /^\/site\.git(\/.*)?$/,
  gitServer(fixPath('site/site.git'), function(callback) {
    callback(null, 'push hook run')
  })
)

// Static site server
server.route(
  /.*/,
  serveStatic(fixPath('site/www'), {
    dotfiles: 'ignore'
  })
)

// Handle 404
server.route(
  /.*/,
  fileServer(fixPath('site/www'), config.errorPages['404'])
)

/* End route definitions */


// Create the server
exports.runServer = function (port, host, callback) {
  var serv = server.makeServer()
  serv.listen(port, host, callback)
}
