const spawn = require('child_process').spawn
const backend = require('git-http-backend')
const logger = require('./logger')

// Returns a node http API-compatible server which handles git interaction with
// a specified git repo on disk, using the system's installation of git
module.exports = (repo) => (req, res) => {
  req.pipe(backend(req.url, (err, service) => {
    // Handle error in user's request (no logging required)
    if (err) return res.end(err + '\n')

    res.setHeader('content-type', service.type)

    // Use system's installation of git
    const ps = spawn(service.cmd, service.args.concat(repo))
    ps.stdout.pipe(service.createStream()).pipe(ps.stdin)

    // Handle logging
    ps.on('close', (code) => {
      if (code != 0) {
        logger.logWarn('Git operation failed')
      } else {
        if (service.action == 'pull') {
          logger.logInfo('Git pull')
        } else if (service.action == 'push' && service.fields.head) {
          logger.logInfo('Git push (head at %s)', service.fields.head.substring(0, 7))
        }
      }
    })
  })).pipe(res)
}
