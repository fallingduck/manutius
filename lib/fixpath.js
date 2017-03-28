var path = require('path')

// Ensures that a path is resolved to be relative to the main script's directory
module.exports = function(p) {
  return path.join(path.dirname(require.main.filename), p)
}
