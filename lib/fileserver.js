var serveStatic = require('serve-static')

module.exports = function(root, relativePath) {
  var server = serveStatic(root)
  return function(req, res, next) {
    req.url = relativePath
    return server(req, res, next)
  }
}
