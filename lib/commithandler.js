var path = require('path')
var fs = require('fs')
var spawn = require('child_process').spawn
var logger = require('./logger')

module.exports = function(root, repo, siteDir, siteRoot) {
  var tempDir = siteDir + '-temp'
  return function() {
    var p = spawn('rm', ['-rf', tempDir], {cwd: root})
    p.on('close', function(code) {
      if (code != 0) {
        logger.logWarn('Site update failed.')
      } else {
        var q = spawn('git', ['clone', repo, tempDir], {cwd: root})
        q.on('close', function(code) {
          if (code != 0) {
            logger.logWarn('Site update failed.')
          } else {
            fs.access(path.join(root, tempDir, siteRoot), fs.constants.R_OK, function(err) {
              if (err) {
                logger.logWarn('Site update failed.')
              } else {
                var r = spawn('rm', ['-rf', path.join(siteDir)], {cwd: root})
                r.on('close', function(code) {
                  if (code != 0) {
                    logger.logWarn('Site update failed.')
                  } else {
                    var s = spawn('mv', [path.join(tempDir, siteRoot), siteDir], {cwd: root})
                    s.on('close', function(code) {
                      if (code != 0) {
                        logger.logWarn('Site update failed.')
                      } else {
                        var t = spawn('rm', ['-rf', tempDir], {cwd: root})
                        t.on('close', function(code) {
                          if (code != 0) {
                            logger.logWarn('Site update failed.')
                          } else {
                            logger.logInfo('Site update succeeded.')
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}
