const { User } = require("../../models")
// const { userModel } = require("../model")

class userRepository {

  static create(name, email, password, role) {
    return User.create({ name, email, password, role })
  }

  static update(name, email, password, role, id) {
    return User.update({ name, email, password, role }, { where: { id } })
  }

  static findAll() {
    return User.findAll({ where: { role: "admin" } })
  }

  static findOneEmail(email) {
    return User.findOne({ where: { email } })
  }

  static findOne(id) {
    return User.findOne({ where: { id } })
  }

  static deleteAdmin(id) {
    return User.destroy({ where: { id } })
  }
}


module.exports = userRepository