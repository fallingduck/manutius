var fixPath = require('./fixpath')

var spawn = require('child_process').spawn
var logger = require('./logger')

module.exports = function(root, repo, siteDir, siteRoot) {
  var tempDir = siteDir + '-temp'
  return function() {
    var p = spawn(fixPath('lib/hook'), [tempDir, repo, siteRoot, siteDir], {cwd: root})
    p.on('close', function(code) {
      if (code != 0) {
        logger.logWarn('Site update failed.')
      } else {
        logger.logInfo('Site update succeeded.')
      }
    })
  }
}
