var fs = require('fs')
var util = require('util')
var yaml = require('js-yaml')
var fixPath = require('./fixpath')

var config = yaml.safeLoad(fs.readFileSync(fixPath('config.yaml'), 'utf8'))
var level = config.log_level

var now = function() {
  var date = new Date()
  return date.toISOString().substring(0, 19)
}

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
