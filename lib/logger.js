var util = require('util')
var fixPath = require('./fixpath')

/* Get the logging level from the config */
var config = require(fixPath('config.json'))
var level = config.logLevel

/* Returns a timestamp string for use in the logger */
var now = function() {
  var date = new Date()
  return date.toISOString().substring(0, 19)
}

/* There are two logging levels: INFO (2) and WARN (1) */
module.exports = {
  logInfo: function() {
    if (level > 1) {
      process.stdout.write('[')
      process.stdout.write(now())
      process.stdout.write('][INFO] ')
      process.stdout.write(util.format.apply(this, arguments))
      process.stdout.write('\n')
    }
  },
  logWarn: function() {
    if (level > 0) {
      process.stdout.write('[')
      process.stdout.write(now())
      process.stdout.write('][WARN] ')
      process.stdout.write(util.format.apply(this, arguments))
      process.stdout.write('\n')
    }
  }
}
