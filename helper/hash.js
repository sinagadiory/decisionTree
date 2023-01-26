const bcrypt = require("bcrypt")

function hash(password) {
  return bcrypt.hashSync(password, 10)
}

module.exports = hash