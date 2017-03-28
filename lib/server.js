http = require('http')

// Array which stores the routes that the server will check requests against
var routes = []
exports.routes = routes

// Wrapper function which pushes routes to the array
exports.route = function(pattern, f) {
  routes.push(function(req, res, next) {
    if (req.url.match(pattern)) {
      f(req, res, next)
    } else {
      next(req, res)
    }
  })
}

var makeRouter = function() {
  return routes.reduceRight(function(b, a, i, z) {
    return function(req, res) {
      a(req, res, function() { return b(req, res) })
    }
  })
}

exports.makeServer = function() {
  return http.createServer(makeRouter())
}
