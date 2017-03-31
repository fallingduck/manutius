var path = require('path')
var spawn = require('child_process').spawn
var backend = require('git-http-backend')
var zlib = require('zlib')

module.exports = function(basedir, pushHook) {
  return function(req, res) {
    var repo = req.url.split('/')[1]
    var dir = path.join(basedir, repo)
    var reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req

    reqStream.pipe(backend(req.url, function (err, service) {
        if (err) {
          return res.end(err + '\n')
        }

        res.setHeader('content-type', service.type)
        console.log(service.action, repo, service.fields)

        var ps = spawn(service.cmd, service.args.concat(dir))
        ps.stdout.pipe(service.createStream()).pipe(ps.stdin)

        if (service.action == "push") {
          pushHook()
        }
    })).pipe(res)
  }
}
