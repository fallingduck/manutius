var serveStatic = require('serve-static')

/* Special node http API-compatible server to handle binding a static file to a
   route
   */
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
