var fs = require('fs')
var yaml = require('js-yaml')
var fixPath = require('./fixpath')

var config = yaml.safeLoad(fs.readFileSync(fixPath('config.yaml'), 'utf8'))
var level = config.log_level

module.exports = {
  logInfo: function() {
    if (level > 1) {
      console.log.apply(this, arguments)
    }
  },
  logWarn: function() {
    if (level > 0) {
      console.log.apply(this, arguments)
    }
  }
}
