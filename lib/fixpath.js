const path = require('path')

// Ensures that a path is relative to the main script's directory
module.exports = (p) => path.join(path.dirname(require.main.filename), p)
