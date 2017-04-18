var fixPath = require('./fixpath')

var path = require('path')
var serveStatic = require('serve-static')
var authServer = require('./authserver')
var gitServer = require('./gitserver')
var fileServer = require('./fileserver')
var server = require('./server')
var logger = require('./logger')

var config = require(fixPath('config.json'))

var siteRoot = path.join(fixPath('site'), config.siteRoot)


/* Begin route definitions */

/* Git server authorization */
server.route(
  /^\/site\.git(\/.*)?$/,
  authServer(fixPath('users.json'))
)

/* Git server */
server.route(
  /^\/site\.git(\/.*)?$/,
  gitServer(fixPath('site'))
)

/* Static site server */
server.route(
  /.*/,
  serveStatic(siteRoot, {
    dotfiles: 'ignore'
  })
)

/* Handle 404 */
server.route(
  /.*/,
  fileServer(siteRoot, config.errorPages['404'], 404)
)

/* Worst-case 404 */
server.route(
  /.*/,
  function(req, res) {
    res.statusCode = 404
    res.end('404\n')
  }
)

/* End route definitions */


/* Create the server */
exports.runServer = function (port, host, callback) {
  var serv = server.makeServer()
  serv.listen(port, host, callback)
}
