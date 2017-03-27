var http = require('http')

// Array which stores the routes that the server will check requests against
var routes = []

// Wrapper function which pushes routes to the array
var route = function(pattern, f) {
  routes.push(function(req, res, next) {
    if (req.url.match(pattern)) {
      f(req, res, next)
    } else {
      next(req, res)
    }
  })
}


/* Begin route definitions */

route(/^\/\.git$/, function(req, res) {
  res.end('git server')
})

route(/.*/, function(req, res) {
  res.end('static file server')
})

/* End route definitions */


// Reduce the array of routes into a single router function
var router = routes.reduceRight(function(b, a, i, z) {
  return function(req, res) {
    a(req, res, b)
  }
})

// Create the server
var port = 8080
var host = ''

var server = http.createServer(router)

server.listen(port, host, function() {
  console.log('autarkeia is running on %s:%s', host, port)
})
