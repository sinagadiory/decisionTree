const { User } = require("../../models")
// const { userModel } = require("../model")

class userRepository {

  static create(name, email, password, role, status) {
    return User.create({ name, email, password, role, status })
  }

  static update(name, email, role, status, id) {
    return User.update({ name, email, role, status }, { where: { id } })
  }

  static findAll() {
    return User.findAll({ where: { role: "admin" }, order: [['id', 'DESC']] })
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