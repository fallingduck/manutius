const http = require('http')

// Array which stores the routes that the server will check requests against
const routes = []
exports.routes = routes

// Wrapper function which pushes routes to the array
exports.route = (pattern, f) => {
  routes.push((req, res, next) => {
    if (req.url.match(pattern)) {
      f(req, res, next)
    } else {
      next(req, res)
    }
  })
}

// Turns the route array into a single function compatible with node http and
// express.js APIs
const makeRouter = () => routes.reduceRight(
  (b, a) => (req, res) => a(req, res, () => b(req, res))
)

// Package the defined routes as a node http API-compatible server
exports.makeServer = () => http.createServer(makeRouter())
