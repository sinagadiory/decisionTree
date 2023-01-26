
const bcrypt = require("bcrypt")


function Compare(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash)
}


module.exports = Compare