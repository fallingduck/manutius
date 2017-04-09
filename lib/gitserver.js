var path = require('path')
var spawn = require('child_process').spawn
var backend = require('git-http-backend')
var encode = require('git-side-band-message')
var zlib = require('zlib')
var logger = require('./logger')

module.exports = function(repo, pushHook) {
  return function(req, res) {
    var reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req

    reqStream.pipe(backend(req.url, function (err, service) {
        if (err) {
          return res.end(err + '\n')
        }

        res.setHeader('content-type', service.type)

        if (service.action == 'pull') {
          logger.logInfo('Git pull')
        } else if (service.action == 'push') {
          logger.logInfo('Git push (head at %s)', service.fields.head.substring(0, 7))
        }

        var ps = spawn(service.cmd, service.args.concat(repo))
        ps.stdout.pipe(service.createStream()).pipe(ps.stdin)

        if (service.action == 'push') {
          pushHook()
        }
    })).pipe(res)
  }
}
