const util = require('util')
const fixPath = require('./fixpath')

// Get the logging level from the config
const config = require(fixPath('config.json'))
const level = config.logLevel

// Returns a timestamp string for use in the logger
const now = () => new Date().toISOString().substring(0, 19)

// There are two logging levels: INFO (2) and WARN (1)
module.exports = {

  logInfo: (...args) => {
    if (level > 1) {
      process.stdout.write('[')
      process.stdout.write(now())
      process.stdout.write('][INFO] ')
      process.stdout.write(util.format.apply(this, args))
      process.stdout.write('\n')
    }
  },

  logWarn: (...args) => {
    if (level > 0) {
      process.stdout.write('[')
      process.stdout.write(now())
      process.stdout.write('][WARN] ')
      process.stdout.write(util.format.apply(this, args))
      process.stdout.write('\n')
    }
  }

}
