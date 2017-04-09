var serveStatic = require('serve-static')

module.exports = function(root, relativePath, code) {
  var server = serveStatic(root)
  return function(req, res, next) {
    req.url = relativePath
    if (code) {
      res.statusCode = code
    }
    return server(req, res, next)
  }
}
