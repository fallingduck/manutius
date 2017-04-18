const serveStatic = require('serve-static')

// Special node http API-compatible server to handle binding a static file to a
// route
module.exports = (root, relativePath, code) => {
  const server = serveStatic(root)
  return (req, res, next) => {
    req.url = relativePath
    if (code) res.statusCode = code
    return server(req, res, next)
  }
}
